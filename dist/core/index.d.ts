export { Store, State } from './store';
export { Animator } from './animation';
export { Route } from './route';
export { Screen, Screens } from './screen';
export { Interactor, InteractorLifeCycle } from './interactor';
export { RouterProps, RouterState } from './components';
export { TransitionContext } from './transitionContext';
import { Operation, TransitionStatus } from './transitionContext';
import { Router } from './components';
import { create } from './animation';
import { createStore } from './store';
import { createAtom } from './atom';
export declare const components: {
    Router: typeof Router;
};
export declare const animation: {
    default: typeof create;
};
export declare const interactor: {
    createPopInteractor: (animator: import("./animation").Animator) => import("./interactor").Interactor & import("./interactor").StrictInteractorLifeCycle;
    createPushInteractor: (screen: string, animator: import("./animation").Animator) => import("./interactor").Interactor & import("./interactor").StrictInteractorLifeCycle;
};
export declare const store: {
    create: typeof createStore;
};
export declare const atom: {
    create: typeof createAtom;
};
export declare const transitionContext: {
    Operation: typeof Operation;
    TransitionStatus: typeof TransitionStatus;
};
export declare const navigator: {
    get: (store: import("./atom").Atom<import("./store").State>) => import("./navigator").Navigator;
};
