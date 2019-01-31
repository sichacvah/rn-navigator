import { Screen } from './screen'

export interface Route {
  id: number,
  screen: Screen
}

export function nextRoute(screen: Screen, stack: Array<Route> = []): Route {
  return {
    id: stack.length,
    screen
  }
}


