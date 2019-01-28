type AnyObject = {
  [key in symbol | string | number]: any
}

export function shallowCompare(prevState: AnyObject, nextState: AnyObject, blackList?: Array<string | symbol | number>) {
  const blackListSet = new Set(blackList || [])

  if (!prevState && nextState) return true
  if (!nextState && prevState) return true

  const keys = Object.keys(nextState)
  for (let i = 0;i < keys.length;i++) {
    const key = keys[i]
    if (blackListSet.has(key)) {
      continue
    }

    if (prevState[key] !== nextState[key]) {
      return true
    }
  }

  return false
}

export function last<T>(arr: Array<T>): T | undefined {
  if (!arr) return undefined
  return arr[arr.length - 1]
}

export function init<T>(arr: Array<T>): Array<T> {
  return arr.slice(0, -1)
}

export function iinit<T>(arr: Array<T>): Array<T> {
  return init(init(arr))
}

export function llast<T>(arr: Array<T>): T | undefined {
  return last(iinit(arr))
}