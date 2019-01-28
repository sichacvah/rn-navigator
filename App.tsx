/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Animated, PanResponder, PanResponderInstance} from 'react-native';
import {Router} from './lib/components'
import { Navigator } from './lib/navigator'
import { TransitionContext, Operation, TransitionStatus } from './lib/transitionContext'
import { InteractorLifeCycle, Interactor } from './lib/interactor'
import { Store, State } from './lib/store'
import { Animator } from './lib/animation'

const getTransform = (value?: Animated.Value, operation?: Operation): Object | undefined => {
  if (!value) return undefined
  if (operation === Operation.push) {
    return {
      transform: [{
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [Dimensions.get('window').width, 0]
        })
      }]
    }
  }
  if (operation === Operation.pop) {
    return {
      transform: [{
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Dimensions.get('window').width]
        })
      }]
    }
  }
  
}

type RouteProps = { navigator: Navigator, value: Animated.Value, operation: Operation }

const First: React.SFC<RouteProps> = ({navigator}: RouteProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>First Screen</Text>
      <Text style={styles.instructions}>To get started, edit App.js</Text>
      <Button title='Push Screen 2' onPress={() => navigator.push('Second', {})} />
    </View>
  )
}

function finishInteraction(state: State, canceled: boolean): State {
  const { transitionContext } = state
  if (!transitionContext) return state
  console.log('!canceled!', canceled)
  return {
    ...state,
    transitionContext: {
      ...transitionContext,
      status: TransitionStatus.clearing,
      canceled
    }
  }
}

type OnFinishFn = (canceled: boolean) => void
type UpdateValue = (value: number) => void
const getScreenLifeCycle = (context: {onFinish?: OnFinishFn, updateValue?: UpdateValue}): InteractorLifeCycle => ({
  onPerform: (store: Store, animator: Animator, interactor: Interactor) => {
    const onFinish = (canceled: boolean) => {
      if (canceled) {
        store.swap(finishInteraction, canceled)
      } else {
        store.swap(finishInteraction, canceled)
      }
    }
    const updateValue = (value: number) => {
      animator.getAnimation().value.setValue(value)
    }
    context.updateValue = updateValue.bind(context)
    context.onFinish = onFinish.bind(context)
  }
}) 

class Second extends React.Component<RouteProps> {
  _panResponder: PanResponderInstance
  onFinish?: OnFinishFn
  updateValue?: UpdateValue
  interactionLifeCycle: InteractorLifeCycle

  constructor(props: RouteProps) {
    super(props)

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log('GRANT', gestureState.moveX)
        props.navigator.pop({lifeCicleListener: this.interactionLifeCycle})
      },
      onPanResponderMove: (evt, {moveX}) => {
        // if (moveX / Dimensions.get('window').width > 0.1) {
        //   this.onFinish && this.onFinish(false)
        // } else {
        //   this.onFinish && this.onFinish(true)
        // }
        this.updateValue && this.updateValue(moveX / Dimensions.get('window').width)
      },
      onPanResponderEnd: (evt, {moveX}) => {
        if (moveX / Dimensions.get('window').width > 0.1) {
          this.onFinish && this.onFinish(false)
        } else {
          this.onFinish && this.onFinish(true)
        }
      }
    })
    this.interactionLifeCycle = getScreenLifeCycle(this)
  }


  render() {
    const {navigator, value, operation} = this.props
    const animation = getTransform(value, operation)

    return (
      <Animated.View style={[styles.container, {backgroundColor: 'yellow'}, animation]}>
        <View style={StyleSheet.absoluteFillObject} {...this._panResponder.panHandlers} />
        <Text style={styles.welcome}>Second Screen</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Button title='Pop to Screen 1' onPress={() => navigator.pop({})} />
      </Animated.View>
    )
  }
}


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Router screens={{First, Second}} initialScreen='First' />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    shadowColor: 'black',
    shadowOffset: {
      width: 4,
      height: 8
    },
    shadowRadius: 8,
    shadowOpacity: 0.3
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
