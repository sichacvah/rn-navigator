"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interactor_1 = require("./interactor");
const transitionContext_1 = require("./transitionContext");
const animation_1 = require("./animation");
function dispatcher({ key, store, prev, next, interactor, animator, lifeCicleListener }) {
    const nextTC = next.transitionContext;
    const prevTC = prev.transitionContext;
    if (!nextTC) {
        return store.removeWatch(key);
    }
    if (!prevTC && nextTC.status === transitionContext_1.TransitionStatus.performing) {
        return lifeCicleListener.onPerform(store, animator, interactor);
    }
    if (prevTC && prevTC.status === transitionContext_1.TransitionStatus.performing && nextTC.status === transitionContext_1.TransitionStatus.clearing) {
        return lifeCicleListener.onFinish(store, animator, interactor);
    }
}
function routeTransition(store, options) {
    const { animator, interactor, lifeCicleListener } = options;
    const { currentId } = store.deref();
    const key = `${currentId + 1}-${currentId}-transition`;
    const { transitionContext } = store.deref();
    if (transitionContext) {
        /// do nothing if transition already runing
        return;
    }
    store.addWatch(key, (key, a, prev, next) => {
        dispatcher({
            key,
            store: a,
            prev,
            next,
            interactor,
            animator,
            lifeCicleListener
        });
    });
    store.swap(interactor.prepare);
}
function getLifeCycleMethods(strictLifeCicleListener, lifeCicleListener) {
    if (!lifeCicleListener)
        return strictLifeCicleListener;
    return {
        onPerform: lifeCicleListener.onPerform ? lifeCicleListener.onPerform : strictLifeCicleListener.onPerform,
        onFinish: lifeCicleListener.onFinish ? lifeCicleListener.onFinish : strictLifeCicleListener.onFinish
    };
}
function push(store, screen, options) {
    const animator = options.animator ? options.animator : animation_1.create();
    const interactor = interactor_1.createPushInteractor(screen, animator);
    const strictOptions = {
        animator,
        interactor: options.interactor ? options.interactor : interactor,
        lifeCicleListener: getLifeCycleMethods(interactor, options.lifeCicleListener)
    };
    routeTransition(store, strictOptions);
}
function pop(store, options) {
    const animator = options.animator ? options.animator : animation_1.create();
    const interactor = interactor_1.createPopInteractor(animator);
    const strictOptions = {
        animator,
        interactor: options.interactor ? options.interactor : interactor,
        lifeCicleListener: getLifeCycleMethods(interactor, options.lifeCicleListener)
    };
    routeTransition(store, strictOptions);
}
exports.getNavigator = (store) => ({
    push: (screen, options = {}) => push(store, screen, options),
    pop: (options = {}) => pop(store, options)
});
//# sourceMappingURL=navigator.js.map