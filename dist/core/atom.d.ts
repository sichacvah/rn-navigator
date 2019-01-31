declare type WatcherFn<T> = (key: string, atom: Atom<T>, prev: T, next: T) => void;
declare type SwapFn<T> = (state: T, ...args: any[]) => T;
declare type ValidatorFn<T> = (next: T) => boolean;
export interface Atom<T = any> {
    addWatch: (key: string, watcher: WatcherFn<T>) => void;
    removeWatch: (key: string) => void;
    swap: (fn: SwapFn<T>, ...args: any[]) => void;
    deref: () => T;
    reset: (v: T) => void;
    toString: () => string;
}
interface Options<T> {
    validator?: ValidatorFn<T>;
}
export declare function createAtom<T>(val: T, options?: Options<T>): Atom<T>;
export {};
