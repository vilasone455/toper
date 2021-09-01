import Cookies from 'js-cookie'
import {ThemeActionType, ThemeActionTypes} from './type'

export interface NodeTheme {
    textcolor : string,
    bgcolor : string
}

interface ThemeState {
    darkMode : boolean,
    nodeTheme : NodeTheme
}

const getDefaultDarkMode = () =>{
    console.log('get mode')
    let darkmode = Cookies.get("darkmode")
    if(darkmode === undefined || darkmode === "false") return false
    return true
}

const initialState : ThemeState = {
    darkMode : getDefaultDarkMode(),
    nodeTheme : {
        textcolor : "white",
        bgcolor : "#015AA0"
    }
}

export const themeReducer =  (state = initialState, action : ThemeActionTypes) => {
    switch (action.type) {
    case ThemeActionType.SET_NODE_THEME : 
        return {...state , nodeTheme : action.payload}
    default: 
        return state
    }
}
