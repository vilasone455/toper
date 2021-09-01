import { User , defaultUser, isLogin } from "../../interface/user"
import { AuthActionType , AuthActionTypes} from './type'


export interface AuthState {
    user : User,
    isLogin : boolean,
    err : string
}

const initialState : AuthState = {
    user : defaultUser(),
    isLogin : true,
    err : "no err"
}

export const AuthReducer =  (state  = initialState, action : AuthActionTypes) => {
    switch (action.type) {

    case AuthActionType.SET_USER:
        console.log("set user reducer : "+ JSON.stringify(action.payload))
        return { ...state, user : action.payload }
    case AuthActionType.UPDATE_USER:
        return { ...state, ...action.payload }
    case AuthActionType.SET_LOGIN:
        return { ...state, isLogin : action.payload }
    
    default:
        return state
    }
}
