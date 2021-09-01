import {NodeTheme} from './theme'

export enum ThemeActionType {
    SET_NODE_THEME = "SET_NODE_THEME"
}

interface SetNodeTheme {
    type: typeof ThemeActionType.SET_NODE_THEME,
    payload: NodeTheme
}
  
export type ThemeActionTypes = SetNodeTheme 