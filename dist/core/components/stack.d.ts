import * as React from 'react';
import { Store, State } from '../store';
import { TransitionContext } from '../transitionContext';
export interface StackProps extends State {
    store: Store;
}
export declare function isActive(currentId: number, id: number, transitionContext?: TransitionContext): boolean;
export default class Stack extends React.Component<StackProps> {
    shouldComponentUpdate(prevProps: StackProps): boolean;
    render(): JSX.Element;
}
