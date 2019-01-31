import * as React from 'react'
export type Screen = string
export interface Screens {
  [key: string]: React.ComponentClass<any, any> | React.SFC<any>
}