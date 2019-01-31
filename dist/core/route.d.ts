import { Screen } from './screen';
export interface Route {
    id: number;
    screen: Screen;
}
export declare function nextRoute(screen: Screen, stack?: Array<Route>): Route;
