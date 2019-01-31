import { Route } from './route'
import { Animator } from './animation'

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
  animator:  Animator,
  canceled:   boolean,
  status:     TransitionStatus
}