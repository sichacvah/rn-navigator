import { createAtom, Atom } from './atom'
import { Route } from './route'
import { Screens } from './screen'
import { TransitionContext } from './transitionContext'

export interface Refs {
  [key: number]: Object
}

export interface State {
  stack:      Array<Route>
  currentId:  number,
  screens:    Screens,
  refs:       Refs,
  transitionContext?: TransitionContext,
  raw: {
    [key: string]: number
  }
}

export type Store = Atom<State>


export function createStore(initialScreen: string, screens: Screens): Store {
  const stack = [{ id: 0, screen: initialScreen }]
  return createAtom({
    stack,
    currentId: 0,
    screens,
    refs: {},
    raw: {}
  })
}



