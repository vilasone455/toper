import axios from "axios";
import { Dispatch } from "redux";
import { getLocalProjects } from "../../api/project";
import { LoginPayload } from "../../interface/loginpayload"
import { jsonToProject, Project, projectToJson } from "../../interface/project";
import { User, defaultUser, jsonToUser } from "../../interface/user";
import { ToggleLoading } from "../share/action";
import { DeleteProject, NewProject, SetProject, SetProjectSaveType, ToggleModal, UpdateProject } from "./action";


export interface UpdateProjectProp {
    id : string,
    data : string
}

export const fetchProjectAsync = () => {
    return async (dispatch: Dispatch) => {
        let url = "https://toperbackend.herokuapp.com/project/getprojects"
        dispatch(ToggleLoading(true))
        const rs = await axios.get(url)
        if (rs.status === 200) {
            let projects: Project[] = []
            rs.data.forEach((p: any) => {
                const project: Project = jsonToProject(p)
                projects.push(project)
            })

            dispatch(SetProject(projects))

            dispatch(SetProjectSaveType("cloud"))

        }
        dispatch(ToggleLoading(false))
    };
}

export const newProjectAsync = (project: Project) => {
    return async (dispatch: Dispatch) => {
        let url = "https://toperbackend.herokuapp.com/project"
        let data = projectToJson(project)

        dispatch(ToggleModal(false))
        dispatch(ToggleLoading(true))
        const rs = await axios.post(url, data)
        project.Id = rs.data._id
        if (rs.status === 200) {
            dispatch(NewProject(project))

        }
        dispatch(ToggleLoading(false))
    };
}

export const updateProjectAsync = (project: Project, id: string) => {
    return async (dispatch: Dispatch) => {
        let url = "https://toperbackend.herokuapp.com/project/" + id
        let data = projectToJson(project)

        dispatch(ToggleModal(false))
        dispatch(ToggleLoading(true))
        const rs = await axios.put(url, data)
        if (rs.status === 200) {
            dispatch(UpdateProject({ id: id, data: project }))
        }
        dispatch(ToggleLoading(false))
    };
}

export const deleteProjectLocal = (id: string) => {
    return async (dispatch: Dispatch) => {
        let projects = getLocalProjects()
        let indexof = projects.findIndex(p=>p.Id === id)
        if(indexof === -1) return
        projects.splice(indexof , 1)
        localStorage.setItem("projects" , JSON.stringify(projects))
        dispatch(DeleteProject(id))
    };
}

export const deleteProjectAsync = (id: string) => {
    return async (dispatch: Dispatch) => {
        let url = "https://toperbackend.herokuapp.com/project/delete/" + id
        dispatch(ToggleLoading(true))
        const rs = await axios.delete(url)
        if (rs.status === 200) {
            dispatch(DeleteProject(id))
        }
        dispatch(ToggleLoading(false))
    };
}


export const fetchProjectLocal = () => {
    return async (dispatch: Dispatch) => {
        let projectsStr = localStorage.getItem("projects")
        let rs: any[] = []
        if (projectsStr === null) {
            localStorage.setItem("projects", JSON.stringify(rs))
            return
        }
        dispatch(SetProjectSaveType("device"))

        let projects: any[] = JSON.parse(projectsStr)

        projects.forEach(p => {
            p.ProjectDetail = ""
        });

        dispatch(SetProject(projects))

        //alert(JSON.stringify(projects))
    };
}

export const newProjectLocal = (project: Project) => {
    return async (dispatch: Dispatch) => {

        let projectstr = localStorage.getItem("projects")

        if (projectstr !== null) {
            let projectRs: any[] = JSON.parse(projectstr)
            projectRs.push(project)
            alert(JSON.stringify(projectRs))
            localStorage.setItem("projects", JSON.stringify(projectRs))
            dispatch(SetProject(projectRs))
        }

    };
}

export const saveProjectasync = (data : string , id : string) => {
    return async (dispatch: Dispatch) => {

        
    };
}



export const saveProjectLocal = (updateData : UpdateProjectProp) => {
    return async (dispatch: Dispatch) => {

        let projectstr = localStorage.getItem("projects")

        if (projectstr !== null) {
            let projectRs: any[] = JSON.parse(projectstr)
            console.log(projectRs)
            console.log(updateData.id)
            let indexof = projectRs.findIndex(p=>p.Id === updateData.id)
            if(indexof === -1) return
            console.log(indexof)
            console.log(projectRs[indexof])
            projectRs[indexof].ProjectDetail = updateData.data
            localStorage.setItem("projects", JSON.stringify(projectRs))
        }

    };
}

export const fetchPosts = (loginPayload: LoginPayload) => async (dispatch: any) => {

    dispatch({ type: 'FETCH_POSTS', payload: "" })
}

