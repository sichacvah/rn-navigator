import * as React from 'react';
import { Store, State } from '../store';
import { Screens } from '../screen';
export interface RouterProps {
    initialScreen: string;
    screens: Screens;
}
export interface RouterState {
    store: Store;
    storeState: State;
}
export declare class Router extends React.Component<RouterProps, RouterState> {
    _isMounted?: boolean;
    unsubscribe?: () => void;
    state: RouterState;
    constructor(props: RouterProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    subscribe(): void;
    render(): JSX.Element;
}
