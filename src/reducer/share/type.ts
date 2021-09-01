

export enum ShareActionType {
    TOGGLE_LOADING = "TOGGLE_LOADING",
    SET_FETCH = "SET_FETCH"
}

interface ToggleAction {
    type: typeof ShareActionType.TOGGLE_LOADING
    payload: boolean
}

interface SetFetch {
    type: typeof ShareActionType.SET_FETCH
    payload: boolean
}

  

  
export type ShareActionTypes = ToggleAction | SetFetch