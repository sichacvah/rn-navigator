import { Atom } from './atom';
import { Route } from './route';
import { Screens } from './screen';
import { TransitionContext } from './transitionContext';
export interface Refs {
    [key: number]: Object;
}
export interface State {
    stack: Array<Route>;
    currentId: number;
    screens: Screens;
    refs: Refs;
    transitionContext?: TransitionContext;
    raw: {
        [key: string]: number;
    };
}
export declare type Store = Atom<State>;
export declare function createStore(initialScreen: string, screens: Screens): Store;
