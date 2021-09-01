import { User } from "../../interface/user";
import { AuthActionType, AuthActionTypes } from "./type";

export function SetUser(user: User): AuthActionTypes {
    return {
      type: AuthActionType.SET_USER,
      payload: user
    }
}

export function SetLoginState(data:boolean): AuthActionTypes {
  return {
    type: AuthActionType.SET_LOGIN,
    payload: data
  }
}