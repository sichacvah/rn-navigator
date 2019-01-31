"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const store_1 = require("../store");
const utils_1 = require("../utils");
const stack_1 = __importDefault(require("./stack"));
class Router extends React.Component {
    constructor(props) {
        super(props);
        const store = store_1.createStore(this.props.initialScreen, this.props.screens);
        this.state = {
            store,
            storeState: store.deref()
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.subscribe();
    }
    componentWillUnmount() {
        this._isMounted = false;
        if (this.unsubscribe instanceof Function)
            this.unsubscribe();
    }
    subscribe() {
        const { store } = this.state;
        const key = 'provider';
        store.addWatch(key, (_, __, ___, nextState) => {
            if (!this._isMounted)
                return;
            this.setState(providerState => {
                if (utils_1.shallowCompare(providerState, nextState, ['screens', 'refs'])) {
                    return { storeState: nextState };
                }
                return null;
            });
        });
        const postMountStoreState = store.deref();
        if (postMountStoreState !== this.state.storeState) {
            this.setState({ storeState: postMountStoreState });
        }
        this.unsubscribe = () => this.state.store.removeWatch(key);
    }
    render() {
        return <stack_1.default store={this.state.store} {...this.state.storeState}/>;
    }
}
exports.Router = Router;
//# sourceMappingURL=index.js.map