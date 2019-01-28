import { Route } from './route'
import { Animation } from './animation'

export enum Operation {
  push = 'push',
  pop = 'pop'
}

export enum TransitionStatus {
  preparing = 'preparing',
  performing = 'performing',
  clearing = 'clearing'
}


export interface TransitionContext {
  from?:      Route
  to:         Route
  operation:  Operation,
  animation:  Animation,
  canceled:   boolean,
  status:     TransitionStatus
}