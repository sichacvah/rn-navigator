"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("./atom");
function createStore(initialScreen, screens) {
    const stack = [{ id: 0, screen: initialScreen }];
    return atom_1.createAtom({
        stack,
        currentId: 0,
        screens,
        refs: {},
        raw: {}
    });
}
exports.createStore = createStore;
//# sourceMappingURL=store.js.map