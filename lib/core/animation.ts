import { Animated } from 'react-native'


type Options = {
  from?: number,
  to?: number
}
type Callback = () => void
export interface Animator {
  getValue: () => Animated.Value | Array<Animated.Value>,
  perform: (options?: Options, callback?: Callback) => void
  getDuration: () => number
}

export function create(): Animator {
  const value = new Animated.Value(0)
  const duration = 200
  return {
    getDuration: () => duration,
    getValue: () => value,
    perform: (options = {}, cb) => {
      const {from, to} = options
      if (typeof from === 'number') {
        value.setValue(from)
      }
      const toValue = (typeof to === 'number') ? to : 1
      Animated.spring(value, {
        toValue,
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        useNativeDriver: true
      }).start(() => cb && cb())
    }
  }
}