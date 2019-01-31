declare type AnyObject = {
    [key in symbol | string | number]: any;
};
export declare function shallowCompare(prevState: AnyObject, nextState: AnyObject, blackList?: Array<string | symbol | number>): boolean;
export declare function last<T>(arr: Array<T>): T | undefined;
export declare function init<T>(arr: Array<T>): Array<T>;
export declare function iinit<T>(arr: Array<T>): Array<T>;
export declare function llast<T>(arr: Array<T>): T | undefined;
export {};
