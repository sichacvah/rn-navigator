import { State, Store } from './store'
import { Screen } from './screen'
import { nextRoute, Route } from './route'
import { Animation, Animator } from './animation'
import { Operation, TransitionStatus } from './transitionContext'
import { last, init, llast } from './utils'

export interface Interactor {
  prepare: (state: State) => State
  perform: (state: State) => State
  clear:   (state: State) => State
}

export interface InteractorLifeCycle {
  onPerform?: (store: Store, animator: Animator, interactor: Interactor) => void,
  onFinish?:  (store: Store, animator: Animator, interactor: Interactor) => void
}

export interface StrictInteractorLifeCycle {
  onPerform: (store: Store, animator: Animator, interactor: Interactor) => void,
  onFinish:  (store: Store, animator: Animator, interactor: Interactor) => void
}

export const createPopInteractor = (animation: Animation): Interactor & StrictInteractorLifeCycle => ({
  prepare: (state: State): State => {
    if (state.stack.length < 2) return state
    const route = last(state.stack) as Route
    const prev  = llast(state.stack) as Route
    return {
      ...state,
      transitionContext: {
        from: prev,
        to: route,
        animation,
        operation: Operation.pop,
        canceled: false,
        status: TransitionStatus.performing
      }
    }
  },
  perform: state => {
    if (!state.transitionContext) return state
    return {
      ...state,
      transitionContext: {
        ...state.transitionContext,
        status: TransitionStatus.clearing
      }
    }
  },
  clear: (state: State): State => {
    const { transitionContext } = state
    if (!transitionContext) return state
    const stack = !transitionContext.canceled ? init(state.stack) : state.stack
    return {
      ...state,
      stack,
      transitionContext: undefined
    }
  },
  onPerform: (store: Store, animator: Animator, interactor: Interactor) => {
    const { transitionContext } = store.deref()
    if (!transitionContext) return
    const { animation } = transitionContext
    const onAnimationFinish = () => store.swap(interactor.perform)
    animator.perform({ from: 0, to: 1, duration: animation.duration }, onAnimationFinish)
  },
  onFinish: (store: Store, animator: Animator, interactor: Interactor) => {
    const { transitionContext } = store.deref()
    if (!transitionContext) return
    const { animation } = transitionContext
    const { rawValue } = animation
    const { canceled } = transitionContext
    const onAnimationFinish = () => store.swap(interactor.clear)
    if (canceled) {
      if (rawValue === 0) return onAnimationFinish()
      animator.perform({ from: rawValue, to: 0, duration: animation.duration * (1 - rawValue) }, onAnimationFinish)
    } else {
      if (rawValue === 1) return onAnimationFinish()
      animator.perform({ from: rawValue, to: 1, duration: animation.duration * rawValue }, onAnimationFinish)
    }
  }
})

export const createPushInteractor = (screen: Screen, animation: Animation): Interactor & StrictInteractorLifeCycle => ({
  prepare: (state: State): State => {
    const route = nextRoute(screen, state.stack)
    const lastRoute = last(state.stack)
    return {
      ...state,
      stack: state.stack.concat([route]),
      currentId: route.id,
      transitionContext: {
        from: lastRoute,
        to:   route,
        animation,
        operation: Operation.push,
        canceled: false,
        status: TransitionStatus.performing
      }
    }
  },
  perform: state => {
    if (!state.transitionContext) return state
    return {
      ...state,
      transitionContext: {
        ...state.transitionContext,
        status: TransitionStatus.clearing
      }
    }
  },
  clear: (state: State): State => {
    const { transitionContext } = state
    if (!transitionContext) return state
    const stack = transitionContext.canceled ? init(state.stack) : state.stack
    return {
      ...state,
      stack,
      transitionContext: undefined
    }
  },
  onPerform: (store: Store, animator: Animator, interactor: Interactor) => {
    const { transitionContext } = store.deref()
    if (!transitionContext) return
    const { animation } = transitionContext
    const perform = () => store.swap(interactor.perform)
    animator.perform({ from: 0, to: 1, duration: animation.duration }, perform)
  },
  onFinish: (store: Store, animator: Animator, interactor: Interactor) => {
    const { transitionContext } = store.deref()
    if (!transitionContext) return
    const { animation } = transitionContext
    const { rawValue } = animation
    const { canceled } = transitionContext
    const onAnimationFinish = () => store.swap(interactor.clear)
    if (canceled) {
      if (rawValue === 0) return onAnimationFinish()
      animator.perform({ from: rawValue, to: 0, duration: animation.duration * (1 - rawValue) }, onAnimationFinish)
    } else {
      if (rawValue === 1) return onAnimationFinish()
      animator.perform({ from: rawValue, to: 1, duration: animation.duration * rawValue }, onAnimationFinish)
    }
  }
})
