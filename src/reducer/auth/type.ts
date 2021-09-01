import { User } from "../../interface/user";

export enum AuthActionType {
    SET_USER = "SET_USER",
    UPDATE_USER = "UPDATE_USER",
    SET_LOGIN = "SET_LOGIN"
}

interface UpdatePayload {
    Id : string,
    user : User
}

export interface SetUserAction {
    type: typeof AuthActionType.SET_USER
    payload: User
}

export interface UpdatetUserAction {
    type: typeof AuthActionType.UPDATE_USER
    payload: UpdatePayload
}

export interface SetLoginStateAction {
    type: typeof AuthActionType.SET_LOGIN
    payload: boolean
}

  
export type AuthActionTypes = SetUserAction | UpdatetUserAction | SetLoginStateAction