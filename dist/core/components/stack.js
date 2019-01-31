"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_screens_1 = require("react-native-screens");
const navigator_1 = require("../navigator");
const utils_1 = require("../utils");
function isActive(currentId, id, transitionContext) {
    if (currentId === id)
        return true;
    if (!transitionContext)
        return false;
    const { from, to } = transitionContext;
    if (from && from.id === id) {
        return true;
    }
    if (to.id === id) {
        return true;
    }
    return false;
}
exports.isActive = isActive;
class Stack extends React.Component {
    shouldComponentUpdate(prevProps) {
        const { props } = this;
        return utils_1.shallowCompare(prevProps, props, ['raw']);
    }
    render() {
        const { props } = this;
        const { stack, store, transitionContext, currentId } = props;
        const navigator = navigator_1.getNavigator(store);
        const { screens } = store.deref();
        return (React.createElement(react_native_screens_1.ScreenContainer, { style: react_native_1.StyleSheet.absoluteFill }, stack.map(route => {
            const RouteComponent = screens[route.screen];
            // const element = (typeof RouteComponent === 'function') ?  : <RouteComponent route={route} navigator={navigator} ref={(comp: Object) => store.swap(addComponentReference, route.id, comp)} />
            const active = isActive(currentId, route.id, transitionContext);
            return (React.createElement(react_native_screens_1.Screen, { key: route.id, active: active, style: react_native_1.StyleSheet.absoluteFillObject },
                React.createElement(RouteComponent, { route: route.id, transitionContext: transitionContext, navigator: navigator })));
        })));
    }
}
exports.default = Stack;
//# sourceMappingURL=stack.js.map