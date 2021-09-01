export enum AlertActionType {
    SET_ERROR = "SET_ERROR",
    HIDE_ERROR = "HIDE_ERROR",
}

interface HideErrorType {
    type: typeof AlertActionType.HIDE_ERROR
    payload: void
}

interface SetErrorType {
    type: typeof AlertActionType.SET_ERROR
    payload: string
}

export type AlertActionTypes = SetErrorType |   HideErrorType