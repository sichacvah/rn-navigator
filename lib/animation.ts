import { Animated } from 'react-native'

export interface Animation {
  value: Animated.Value,
  duration: number
}


export interface Animator {
  getAnimation: () => Animation,
  perform: (options: {from: number, to: number, duration: number}, callback?: () => void) => void
}

export function create(): Animator {
  const value = new Animated.Value(0)
  return {
    getAnimation: () => ({
      value,
      rawValue: 0,
      duration: 200
    }),
    perform: ({from, to, duration}, cb) => {
      value.setValue(from)
      Animated.timing(value, { toValue: to, duration, useNativeDriver: true }).start(cb)
    }
  }
}