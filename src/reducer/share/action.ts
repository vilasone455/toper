
import { ShareActionType, ShareActionTypes } from "./type";

export function ToggleLoading(data: boolean): ShareActionTypes {
    return {
      type: ShareActionType.TOGGLE_LOADING,
      payload: data
    }
}

export function SetFetchAction(data: boolean): ShareActionTypes {
  return {
    type: ShareActionType.SET_FETCH,
    payload: data
  }
}