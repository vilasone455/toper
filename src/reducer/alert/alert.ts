
import { AlertActionType , AlertActionTypes} from './type'


export interface AlertState {
    error : string,
    isOpen : boolean
}

const initialState : AlertState = {
    error : "",
    isOpen : false
}

export const alertReducer =  (state  = initialState, action : AlertActionTypes) => {
    switch (action.type) {

    case AlertActionType.SET_ERROR:
        return { ...state, error : action.payload , isOpen : true }
    case AlertActionType.HIDE_ERROR:
        return { ...state, error : "" , isOpen : false }

    default:
        return state
    }
}