import axios from "axios";
import { Dispatch } from "redux";
import Cookies from "js-cookie"
import { SetFetchAction, ToggleLoading } from "./share/action";
import { jsonToProject, Project } from "../interface/project";
import { jsonToUser } from "../interface/user";
import { SetLoginState, SetUser } from "./auth/action";
import { SetProject, SetProjectSaveType } from "./project/action";
import { truncate } from "fs";


export const initApp = () => {

    return async (dispatch : Dispatch ) => {

      let baseUrl = "https://toperbackend.herokuapp.com"
      let userUrl = baseUrl + "/user/getuser"
      let projectUrl = baseUrl + "/project/getprojects"

      let token = Cookies.get("ertoken")

      if(token === "" || token === undefined){
            dispatch(ToggleLoading(false))
            dispatch(SetLoginState(false))
  
            return
      }

      dispatch(ToggleLoading(true))
      dispatch(SetFetchAction(false))

      axios.defaults.headers.common['Authorization'] = "Bearer " + token

      axios.all([
        axios.get(userUrl), 
        axios.get(projectUrl)
      ])
      .then(axios.spread((userrs, projectrs) => {

        dispatch(ToggleLoading(false))

        if(userrs.data.length > 0){
            let userdata = userrs.data[0]
            const user = jsonToUser(userdata)
            dispatch(SetUser(user))
            dispatch(SetLoginState(true))
        }
        let projects : Project[] = []
        projectrs.data.forEach((p : any) =>{
            const project : Project = jsonToProject(p)
            projects.push(project)
        })

        dispatch(SetProjectSaveType("cloud"))

        dispatch(SetProject(projects))

        dispatch(SetFetchAction(true))

      }));      
      
    };
}