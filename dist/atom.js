"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAtom(val, options = {}) {
    var watchers = {};
    var validator = options && options.validator || function () { return true; };
    function transition(next) {
        if (!validator(next)) {
            var err = new Error(next + " failed validation");
            err.name = "AssertionError";
            throw err;
        }
        var prev = val;
        val = next;
        Object.keys(watchers).forEach(function (k) {
            watchers[k](k, atom, prev, next);
        });
    }
    let atom = {
        addWatch: function (key, fn) {
            watchers[key] = fn;
        },
        removeWatch: function (key) {
            delete watchers[key];
        },
        swap: function (fn, ...args) {
            transition(fn(val, ...args));
        },
        reset: function (v) {
            transition(v);
        },
        deref: function () {
            return val;
        },
        toString: function () {
            return "Atom(" + JSON.stringify(val) + ")";
        }
    };
    return atom;
}
exports.createAtom = createAtom;
;
//# sourceMappingURL=atom.js.map