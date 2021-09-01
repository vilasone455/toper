
import { ShareActionTypes , ShareActionType } from './type'

interface ShareState {
    error : string,
    isLoading : boolean,
    isFetch : boolean
}

const initialState : ShareState = {
    isFetch : false,
    error : "",
    isLoading : false,
}

export const ShareReducer =  (state = initialState, action : ShareActionTypes) => {
    switch (action.type) {
    case ShareActionType.TOGGLE_LOADING:
        return { ...state, isLoading : action.payload }
    case ShareActionType.SET_FETCH:
            return { ...state, isFetch : action.payload }
    default:
        return state
    }
}
