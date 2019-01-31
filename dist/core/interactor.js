"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const transitionContext_1 = require("./transitionContext");
const utils_1 = require("./utils");
exports.createPopInteractor = (animator) => ({
    prepare: (state) => {
        if (state.stack.length < 2)
            return state;
        const route = utils_1.last(state.stack);
        const prev = utils_1.llast(state.stack);
        return {
            ...state,
            transitionContext: {
                to: prev,
                from: route,
                animator,
                operation: transitionContext_1.Operation.pop,
                canceled: false,
                status: transitionContext_1.TransitionStatus.performing
            },
            currentId: prev.id
        };
    },
    perform: state => {
        if (!state.transitionContext)
            return state;
        return {
            ...state,
            transitionContext: {
                ...state.transitionContext,
                status: transitionContext_1.TransitionStatus.clearing
            }
        };
    },
    clear: (state) => {
        const { transitionContext } = state;
        if (!transitionContext)
            return state;
        const stack = !transitionContext.canceled ? utils_1.init(state.stack) : state.stack;
        const { from, to } = transitionContext;
        return {
            ...state,
            stack,
            transitionContext: undefined,
            currentId: transitionContext.canceled ? from.id : to.id
        };
    },
    onPerform: (store, animator, interactor) => {
        const { transitionContext } = store.deref();
        if (!transitionContext)
            return;
        const onAnimationFinish = () => store.swap(interactor.perform);
        animator.perform({ from: 0, to: 1 }, onAnimationFinish);
    },
    onFinish: (store, animator, interactor) => {
        const { transitionContext } = store.deref();
        if (!transitionContext)
            return;
        const { canceled } = transitionContext;
        const onAnimationFinish = () => store.swap(interactor.clear);
        if (canceled) {
            animator.perform({ to: 0 }, onAnimationFinish);
        }
        else {
            animator.perform({ to: 1 }, onAnimationFinish);
        }
    }
});
exports.createPushInteractor = (screen, animator) => ({
    prepare: (state) => {
        const route = route_1.nextRoute(screen, state.stack);
        const lastRoute = utils_1.last(state.stack);
        return {
            ...state,
            stack: state.stack.concat([route]),
            currentId: route.id,
            transitionContext: {
                from: lastRoute,
                to: route,
                animator: animator,
                operation: transitionContext_1.Operation.push,
                canceled: false,
                status: transitionContext_1.TransitionStatus.performing
            }
        };
    },
    perform: state => {
        if (!state.transitionContext)
            return state;
        return {
            ...state,
            transitionContext: {
                ...state.transitionContext,
                status: transitionContext_1.TransitionStatus.clearing
            }
        };
    },
    clear: (state) => {
        const { transitionContext } = state;
        if (!transitionContext)
            return state;
        const stack = transitionContext.canceled ? utils_1.init(state.stack) : state.stack;
        return {
            ...state,
            stack,
            currentId: stack.length - 1,
            transitionContext: undefined
        };
    },
    onPerform: (store, animator, interactor) => {
        const { transitionContext } = store.deref();
        if (!transitionContext)
            return;
        const perform = () => store.swap(interactor.perform);
        animator.perform({ from: 0, to: 1 }, perform);
    },
    onFinish: (store, animator, interactor) => {
        const { transitionContext } = store.deref();
        if (!transitionContext)
            return;
        const { canceled } = transitionContext;
        const onAnimationFinish = () => store.swap(interactor.clear);
        if (canceled) {
            // if (rawValue === 0) return onAnimationFinish()
            animator.perform({ to: 0 }, onAnimationFinish);
        }
        else {
            // if (rawValue === 1) return onAnimationFinish()
            animator.perform({ to: 1 }, onAnimationFinish);
        }
    }
});
//# sourceMappingURL=interactor.js.map