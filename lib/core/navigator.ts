import { State, Store } from './store'
import { Screen } from './screen'
import { Interactor, InteractorLifeCycle, createPopInteractor, createPushInteractor, StrictInteractorLifeCycle } from './interactor'
import {  TransitionStatus } from './transitionContext'
import { Animator, create } from './animation'


type DispatcherOptions = {
  key: string,
  store: Store,
  prev: State,
  next: State,
  interactor: Interactor,
  animator: Animator,
  lifeCicleListener: StrictInteractorLifeCycle
}

function dispatcher({key, store, prev, next, interactor, animator, lifeCicleListener}: DispatcherOptions) {
  const nextTC = next.transitionContext
  const prevTC = prev.transitionContext
  if (!nextTC) {
    return store.removeWatch(key)
  }
  if (!prevTC && nextTC.status === TransitionStatus.performing) {
    return lifeCicleListener.onPerform(store, animator, interactor)
  }
  if (prevTC && prevTC.status === TransitionStatus.performing && nextTC.status === TransitionStatus.clearing) {
    return lifeCicleListener.onFinish(store, animator, interactor)
  }
}

export interface RouteTransitionOptions {
  animator?: Animator,
  interactor?: Interactor,
  lifeCicleListener?: InteractorLifeCycle
}

export interface RouteTransitionOptionsStrict {
  animator: Animator,
  interactor: Interactor,
  lifeCicleListener: StrictInteractorLifeCycle
}
function routeTransition(store: Store, options: RouteTransitionOptionsStrict) {
  const { animator, interactor, lifeCicleListener } = options
  const { currentId } = store.deref()
  const key = `${currentId+1}-${currentId}-transition`
  const { transitionContext } = store.deref()
  if (transitionContext) {
    /// do nothing if transition already runing
    return
  }
  store.addWatch(key, (key, a, prev, next) => {
    dispatcher({
      key,
      store: a,
      prev,
      next,
      interactor,
      animator,
      lifeCicleListener
    })
  })
  
  store.swap(interactor.prepare)
}

function getLifeCycleMethods(strictLifeCicleListener: StrictInteractorLifeCycle, lifeCicleListener?: InteractorLifeCycle): StrictInteractorLifeCycle {
  if (!lifeCicleListener) return strictLifeCicleListener
  return {
    onPerform: lifeCicleListener.onPerform ? lifeCicleListener.onPerform : strictLifeCicleListener.onPerform,
    onFinish: lifeCicleListener.onFinish ? lifeCicleListener.onFinish : strictLifeCicleListener.onFinish
  }
}

function push(store: Store, screen: Screen, options: RouteTransitionOptions) {
  const animator = options.animator ? options.animator : create()
  const interactor = createPushInteractor(screen, animator)
  const strictOptions = {
    animator,
    interactor: options.interactor ? options.interactor : interactor,
    lifeCicleListener: getLifeCycleMethods(interactor, options.lifeCicleListener)
  }

  routeTransition(store, strictOptions)
}

function pop(store: Store, options: RouteTransitionOptions) {
  const animator = options.animator ? options.animator : create()
  const interactor = createPopInteractor(animator)
  const strictOptions = {
    animator,
    interactor: options.interactor ? options.interactor : interactor,
    lifeCicleListener: getLifeCycleMethods(interactor, options.lifeCicleListener)
  }

  routeTransition(store, strictOptions)
}

export interface Navigator {
  push: (screen: Screen, options: RouteTransitionOptions) => void,
  pop:  (options: RouteTransitionOptions) => void
}

export const getNavigator = (store: Store): Navigator => ({
  push: (screen, options = {}) => push(store, screen, options),
  pop:  (options = {}) => pop(store, options)
})