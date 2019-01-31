import { Animated } from 'react-native'
import navigator from '../lib'
import { State } from '../lib/core/store'
import { Animator } from '../lib/core/animation'

const { core } = navigator


describe('#core.animation.create', () => {
  test('should return valid animator for default animations', () => {
    const animator = core.animation.default()

    expect(animator.getDuration()).toEqual(200)

    expect(animator.getValue()).toEqual(new Animated.Value(0))    

    const cb = () => {}

    animator.perform({}, cb)
  })
})


describe('#core.interactor.createPopInteractor', () => {
  test('should return valid pop interactor', () => {
    const animator = core.animation.default()
    const interactor = core.interactor.createPopInteractor(animator)
    const First = () => null
    const Second = () => null
    const state = {
      stack: [{ id: 0, screen: 'First'}, { id: 1, screen: 'Second'}],
      currentId: 1,
      transitionContext: undefined,
      screens: { First, Second },
      refs: {},
      raw: {}
    }

    const expected = {
      ...state,
      currentId: 0,
      transitionContext: {
        from:       { id: 1, screen: 'Second' },
        to:         { id: 0, screen: 'First' },
        animator,
        operation:  core.transitionContext.Operation.pop,
        canceled:   false,
        status:     core.transitionContext.TransitionStatus.performing
      }
    }

    expect(interactor.prepare({
      ...state,
      stack: []
    })).toEqual({...state, stack: []})
    expect(interactor.prepare(state)).toEqual(expected)

    expect(interactor.perform(state)).toEqual(state)

    expect(interactor.perform(expected)).toEqual({
      ...expected,
      transitionContext: {
        ...expected.transitionContext,
        status: core.transitionContext.TransitionStatus.clearing
      }
    })

    expect(interactor.clear(expected)).toEqual({
      ...expected,
      stack: [{ id: 0, screen: 'First'}],
      transitionContext: undefined,
      currentId: 0
    })

    expect(interactor.clear({
      ...expected,
      transitionContext: undefined
    })).toEqual({
      ...expected,
      transitionContext: undefined
    })


    expect(interactor.clear({
      ...expected,
      transitionContext: {
        ...expected.transitionContext,
        canceled: true
      }
    })).toEqual({
      ...expected,
      stack: state.stack,
      transitionContext: undefined,
      currentId: 1
    })

  })

  test('#lifecycle.onPerform', () => {
    let fromExpected
    let toExpected
    let finalState
    const perform = (options?: {from?: number, to?: number}, cb?: () => void) => {
      if (!options) return
      const { from, to } = options
      fromExpected = from
      toExpected = to
      cb && cb()
      finalState = state

    }
    const animator = { ...core.animation.default(), perform }

    const lifecycle = core.interactor.createPopInteractor(animator)

    const interactor = {
      ...lifecycle,
      perform: (state: State) => {
        return state
      }
    }

    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    store.swap(state => ({
      ...state,
      stack: state.stack.concat({ screen: 'Second', id: 1 }),
      currentId: 1
    }))
    store.swap(interactor.prepare)
    const state = store.deref()

    expect(lifecycle.onPerform(store, animator, interactor)).toEqual(undefined)
    expect(fromExpected).toEqual(0)
    expect(toExpected).toEqual(1)
    expect(finalState).toEqual(state)

    store.swap(interactor.clear)

    fromExpected = 100
    toExpected = 100

    expect(lifecycle.onPerform(store, animator, interactor)).toEqual(undefined)

    expect(fromExpected).toEqual(100)
    expect(toExpected).toEqual(100)
    expect(finalState).toEqual(state)
  })


  test('#lifecycle.onFinish', () => {
    let toExpected
    let finalState
    const perform = (options?: {from?: number, to?: number}, cb?: () => void) => {
      if (!options) return
      const { to } = options
      toExpected = to
      cb && cb()
      finalState = store.deref()
    }
    const animator = { ...core.animation.default(), perform }

    const lifecycle = core.interactor.createPopInteractor(animator)

    const interactor = {
      ...lifecycle,
      perform: (state: State) => {
        return state
      }
    }

    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    store.swap(state => ({
      ...state,
      stack: state.stack.concat({ screen: 'Second', id: 1 }),
      currentId: 1
    }))
    store.swap(interactor.prepare)
    store.swap(interactor.perform)
    const state = store.deref()

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)
    expect(toExpected).toEqual(1)
    expect(finalState).toEqual(interactor.clear(state))


    toExpected = 100

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)

    expect(toExpected).toEqual(100)
    expect(finalState).toEqual(interactor.clear(state))

    store.swap(state => ({
      ...state,
      stack: state.stack.concat({ screen: 'Second', id: 1 }),
      currentId: 1
    }))
    store.swap(interactor.prepare)
    store.swap(interactor.perform)
    store.swap(state => {
      if (!state.transitionContext) return state
      return {
        ...state,
        transitionContext: {
          ...state.transitionContext,
          canceled: true
        }
      }
    })

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)
    expect(toExpected).toEqual(0)
  })
})


describe('#core.interactor.createPushInteractor', () => {
  test('#lifecycle.onFinish', () => {
    let toExpected
    let finalState
    const perform = (options?: {from?: number, to?: number}, cb?: () => void) => {
      if (!options) return
      const { to } = options
      toExpected = to
      cb && cb()
      finalState = store.deref()
    }
    const animator = { ...core.animation.default(), perform }

    const lifecycle = core.interactor.createPushInteractor('Second', animator)

    const interactor = {
      ...lifecycle,
      perform: (state: State) => {
        return state
      }
    }

    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    store.swap(interactor.prepare)
    store.swap(interactor.perform)
    const state = store.deref()

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)
    expect(toExpected).toEqual(1)
    expect(finalState).toEqual(interactor.clear(state))


    toExpected = 100

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)

    expect(toExpected).toEqual(100)
    expect(finalState).toEqual(interactor.clear(state))

    store.swap(interactor.prepare)
    store.swap(interactor.perform)
    store.swap(state => {
      if (!state.transitionContext) return state
      return {
        ...state,
        transitionContext: {
          ...state.transitionContext,
          canceled: true
        }
      }
    })

    expect(lifecycle.onFinish(store, animator, interactor)).toEqual(undefined)
    expect(toExpected).toEqual(0)
  })


  test('should return valid interactor lifecycle with onPerform method', () => {
    let fromExpected
    let toExpected
    let finalState
    const perform = (options?: {from?: number, to?: number}, cb?: () => void) => {
      if (!options) return
      const { from, to } = options
      fromExpected = from
      toExpected = to
      cb && cb()
    }
    const animator = { ...core.animation.default(), perform }

    const lifecycle = core.interactor.createPushInteractor('Second', animator)

    const interactor = {
      ...lifecycle,
      perform: (state: State) => {
        finalState = state
        return state
      }
    }

    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    store.swap(interactor.prepare)
    const state = store.deref()

    expect(lifecycle.onPerform(store, animator, interactor)).toEqual(undefined)
    expect(fromExpected).toEqual(0)
    expect(toExpected).toEqual(1)
    expect(finalState).toEqual(state)

    store.swap(interactor.clear)

    fromExpected = 100
    toExpected = 100

    expect(lifecycle.onPerform(store, animator, interactor)).toEqual(undefined)

    expect(fromExpected).toEqual(100)
    expect(toExpected).toEqual(100)
    expect(finalState).toEqual(state)
  })

  test('should return valid push interactor', () => {
    const animator = core.animation.default()

    const interactor = core.interactor.createPushInteractor('Second', animator)

    const First = () => null
    const Second = () => null
    const state = {
      stack: [{ id: 0, screen: 'First'}],
      currentId: 0,
      transitionContext: undefined,
      screens: { First, Second },
      refs: {},
      raw: {}
    }
    const expected = {
      ...state,
      stack: [{ id: 0, screen: 'First'}, { id: 1, screen: 'Second'}],
      currentId: 1,
      transitionContext: {
        from: {
          id: 0,
          screen: 'First'
        },
        to: {
          id: 1,
          screen: 'Second'
        },
        animator,
        operation: core.transitionContext.Operation.push,
        status: core.transitionContext.TransitionStatus.performing,
        canceled: false
      }
    }
    expect(interactor.prepare(state)).toEqual(expected)

    expect(interactor.perform(expected)).toEqual({
      ...expected,
      transitionContext: {
        ...expected.transitionContext,
        status: core.transitionContext.TransitionStatus.clearing
      }
    })

    expect(interactor.clear(expected)).toEqual({
      ...expected,
      transitionContext: undefined
    })

    expect(interactor.perform({
      ...expected,
      transitionContext: undefined
    })).toEqual({
      ...expected,
      transitionContext: undefined
    })

    expect(interactor.clear({
      ...expected,
      transitionContext: undefined
    })).toEqual({
      ...expected,
      transitionContext: undefined
    })

    expect(interactor.clear({
      ...expected,
      transitionContext: {
        ...expected.transitionContext,
        canceled: true
      }
    })).toEqual({
      ...expected,
      transitionContext: undefined,
      stack: state.stack,
      currentId: 0
    })

  })


})

describe('#core.navigator', () => {
  test('#core.navigator.push', () => {
    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    const navigator = core.navigator.get(store)
    const animator = core.animation.default()
    navigator.push('Second', { animator })
    expect(store.deref()).toEqual({
      stack: [{ id: 0, screen: 'First' }, { id: 1, screen: 'Second' }],
      currentId: 1,
      screens: { First, Second },
      refs: {},
      raw: {},
      transitionContext: { 
        from: { id: 0, screen: 'First' },
        to: { id: 1, screen: 'Second' },
        animator,
        operation: 'push',
        canceled: false,
        status: 'performing'
      }
    })
  })

  test('#core.navigator.pop', () => {
    const First = () => null
    const Second = () => null

    const store = core.store.create('First', { First, Second })
    const navigator = core.navigator.get(store)
    const animator: Animator = {
      ...core.animation.default(),
      perform: (_, cb) => {
        cb && cb()
      }
    }
    navigator.push('Second', { animator })
    navigator.pop({ animator })
    expect(store.deref()).toEqual({
      stack: [{ id: 0, screen: 'First' }],
      currentId: 0,
      screens: { First, Second },
      refs: {},
      raw: {},
      transitionContext: undefined
    })
  })
})
