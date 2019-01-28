import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Screen, ScreenContainer } from 'react-native-screens'
import { Navigator, getNavigator } from '../navigator'
import { Store, State } from '../store'
import { TransitionContext } from '../transitionContext';

export interface StackProps extends State {
  store: Store
}

export function isActive(currentId: number, id: number, transitionContext?: TransitionContext) {
  if (currentId === id) return true
  if (!transitionContext) return false
  const {from, to} = transitionContext
  if (from && from.id === id) {
    return true
  }
  if (to.id === id) {
    return true
  }
  return false
}

function addComponentReference(state: State, id: number, comp: Object) {
  return {
    ...state,
    refs: {
      ...state.refs,
      [id]: comp
    }
  }
}

const Stack: React.SFC<StackProps> = (props: StackProps) => {
  const { stack, store, transitionContext, currentId } = props
  const navigator = getNavigator(store)
  const { screens } = store.deref()
  return (
    <ScreenContainer style={StyleSheet.absoluteFill}>
      {stack.map(route => {
        const RouteComponent = screens[route.screen]
        // const element = (typeof RouteComponent === 'function') ?  : <RouteComponent route={route} navigator={navigator} ref={(comp: Object) => store.swap(addComponentReference, route.id, comp)} />
        const active = isActive(currentId, route.id, transitionContext)
        return (
          <Screen key={route.id} active={active} style={StyleSheet.absoluteFillObject}>
            <RouteComponent
              route={route}
              operation={transitionContext ? transitionContext.operation : undefined}
              value={transitionContext ? transitionContext.animation.value : undefined}
              navigator={navigator}/>
          </Screen>
        )
      })}
    </ScreenContainer>
  )
}

export default React.memo(Stack)