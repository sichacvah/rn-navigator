"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shallowCompare(prevState, nextState, blackList) {
    const blackListSet = new Set(blackList || []);
    if (!prevState && nextState)
        return true;
    if (!nextState && prevState)
        return true;
    const keys = Object.keys(nextState);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (blackListSet.has(key)) {
            continue;
        }
        if (prevState[key] !== nextState[key]) {
            return true;
        }
    }
    return false;
}
exports.shallowCompare = shallowCompare;
function last(arr) {
    if (!arr)
        return undefined;
    return arr[arr.length - 1];
}
exports.last = last;
function init(arr) {
    return arr.slice(0, -1);
}
exports.init = init;
function iinit(arr) {
    return init(init(arr));
}
exports.iinit = iinit;
function llast(arr) {
    return last(init(arr));
}
exports.llast = llast;
//# sourceMappingURL=index.js.map