import * as React from 'react'
import { createStore, Store, State } from '../store'
import { Screens } from '../screen'
import { shallowCompare } from '../utils'
import Stack from './stack'


export interface RouterProps {
  initialScreen: string,
  screens: Screens
}
export interface RouterState {
  store: Store,
  storeState: State
}
export class Router extends React.Component<RouterProps, RouterState> {
  _isMounted?: boolean
  unsubscribe?: () => void
  state: RouterState

  constructor(props: RouterProps) {
    super(props)

    const store = createStore(this.props.initialScreen, this.props.screens)
    this.state = {
      store,
      storeState: store.deref()
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.subscribe()
  }

  componentWillUnmount() {
    this._isMounted = false
    if (this.unsubscribe instanceof Function) this.unsubscribe() 
  }


  subscribe() {
    const { store } = this.state
    const key = 'provider'

    store.addWatch(key, (_, __, ___, nextState) => {
      if (!this._isMounted) return

      this.setState(providerState => {
        if (shallowCompare(providerState, nextState, ['screens', 'refs'])) {
          return { storeState: nextState }
        }
        return null
      })
    })

    const postMountStoreState = store.deref()
    if (postMountStoreState !== this.state.storeState) {
      this.setState({ storeState: postMountStoreState })
    }

    this.unsubscribe = () => this.state.store.removeWatch(key)
  }

  render() {
    return <Stack store={this.state.store} {...this.state.storeState} />
  }

}