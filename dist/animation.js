"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
function create() {
    const value = new react_native_1.Animated.Value(0);
    const duration = 200;
    return {
        getDuration: () => duration,
        getValue: () => value,
        perform: (options = {}, cb) => {
            const { from, to } = options;
            if (typeof from === 'number') {
                value.setValue(from);
            }
            const toValue = (typeof to === 'number') ? to : 1;
            react_native_1.Animated.spring(value, {
                toValue,
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
                useNativeDriver: true
            }).start(() => cb && cb());
        }
    };
}
exports.create = create;
//# sourceMappingURL=animation.js.map