"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nextRoute(screen, stack = []) {
    return {
        id: stack.length,
        screen
    };
}
exports.nextRoute = nextRoute;
//# sourceMappingURL=route.js.map