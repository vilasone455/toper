import { AlertActionType , AlertActionTypes} from "./type";

export function SetErrorAction(err: string): AlertActionTypes {
    return {
      type: AlertActionType.SET_ERROR,
      payload: err
    }
}

export function HideErrorAction(v:void): AlertActionTypes {
    return {
      type: AlertActionType.HIDE_ERROR,
      payload: v
    }
}

