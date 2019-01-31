import { State, Store } from './store';
import { Animator } from './animation';
export interface Interactor {
    prepare: (state: State) => State;
    perform: (state: State) => State;
    clear: (state: State) => State;
}
export interface InteractorLifeCycle {
    onPerform?: (store: Store, animator: Animator, interactor: Interactor) => void;
    onFinish?: (store: Store, animator: Animator, interactor: Interactor) => void;
}
export interface StrictInteractorLifeCycle {
    onPerform: (store: Store, animator: Animator, interactor: Interactor) => void;
    onFinish: (store: Store, animator: Animator, interactor: Interactor) => void;
}
export declare const createPopInteractor: (animator: Animator) => Interactor & StrictInteractorLifeCycle;
export declare const createPushInteractor: (screen: string, animator: Animator) => Interactor & StrictInteractorLifeCycle;
