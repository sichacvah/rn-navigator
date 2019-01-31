import { State } from './store';
import { Screen } from './screen';
import { Interactor, InteractorLifeCycle, StrictInteractorLifeCycle } from './interactor';
import { Animator } from './animation';
export interface RouteTransitionOptions {
    animator?: Animator;
    interactor?: Interactor;
    lifeCicleListener?: InteractorLifeCycle;
}
export interface RouteTransitionOptionsStrict {
    animator: Animator;
    interactor: Interactor;
    lifeCicleListener: StrictInteractorLifeCycle;
}
export interface Navigator {
    push: (screen: Screen, options: RouteTransitionOptions) => void;
    pop: (options: RouteTransitionOptions) => void;
}
export declare const getNavigator: (store: import("./atom").Atom<State>) => Navigator;
