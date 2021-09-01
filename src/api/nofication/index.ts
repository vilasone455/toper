import {toast} from "react-toastify"
import { SetErrorAction } from "../../reducer/alert/action"
import store from "../../store/index"

export function NoficationIfError(fn ?: (err : string) => void){
    let error = store.getState().alertReducer.error
    if(fn){
        fn(error)
    }
    if(error !== ""){
        toast.error(error)       
        store.dispatch(SetErrorAction(""))
    }

    
    
    
}