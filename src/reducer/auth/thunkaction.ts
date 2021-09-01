import axios from "axios";
import { Dispatch } from "redux";
import { LoginPayload } from "../../interface/loginpayload"
import { User , defaultUser , jsonToUser } from "../../interface/user";
import {SetLoginState, SetUser} from './action'
import Cookies from "js-cookie"
import { SetProject } from "../project/action";
import { ToggleLoading } from "../share/action";
import { toast } from "react-toastify";
import { SetErrorAction } from "../alert/action";


export const signIn = (login : LoginPayload) => {
    return async (dispatch : Dispatch) => {
      let url = "https://toperbackend.herokuapp.com/auth/login"
      try {
        let rs = await axios.post(url , login)
        console.log(rs)

        if(rs.status === 200){
          const data = rs.data
          if(data.access_token !== ""){
              toast.success("Login sucess")
              Cookies.set("ertoken" , data.access_token)
              const user : User = jsonToUser(data)
              dispatch(SetUser(user))
              dispatch(SetLoginState(true))
    
          }
      
        }
      }catch (err) {
        console.log(err)
        toast.error("Wrong User or Password")
      }
    
      
    };
}

export const register = (user : any) => {
  return async (dispatch : Dispatch) => {
    let url = "https://toperbackend.herokuapp.com/auth/register"
    try {

      let rs = await axios.post(url , user)

      const data = rs.data
      if(data.access_token !== ""){
            Cookies.set("ertoken" , data.access_token)
            const user : User = jsonToUser(data)
            dispatch(SetUser(user))
            dispatch(SetLoginState(true))
  
      }
        
    } catch (error) {
      console.log(error.response)
      dispatch(SetErrorAction(error.response.data.message))
    }
  
    
  };
}


export const signOut = () => {
  return async (dispatch : Dispatch) => {
    Cookies.set("ertoken" , "")
    const user : User = defaultUser()
    dispatch(SetUser(user))
    dispatch(SetLoginState(false))
    dispatch(SetProject([]))
  };
}

