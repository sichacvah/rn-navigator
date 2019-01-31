import { Animated } from 'react-native';
declare type Options = {
    from?: number;
    to?: number;
};
declare type Callback = () => void;
export interface Animator {
    getValue: () => Animated.Value | Array<Animated.Value>;
    perform: (options?: Options, callback?: Callback) => void;
    getDuration: () => number;
}
export declare function create(): Animator;
export {};
