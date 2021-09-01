import axios from "axios";
import Cookies from "js-cookie";
import { uniqueId } from "lodash";
import { jsonToProject, Project } from "../../interface/project";
import { v4 as uuidv4 } from 'uuid';
//logic about project 
export const getProjectDetailById = async (saveType : string ,id:string , refProjects : Project[] = []) => {
    
    if (saveType === "device"){
        let projects = (refProjects.length === 0) ? getLocalProjects() : refProjects
        let projectRs = projects.find(p=>p.Id === id)
        if(projectRs === undefined) return
        projectRs.Id = uuidv4()
        alert(JSON.stringify(projectRs))
        return projectRs

    }else if(saveType === "cloud") {
        let token = Cookies.get("ertoken")
        if(token === undefined) return
        axios.defaults.headers.common['Authorization'] = "Bearer " + token
        let projectRs = await axios.get("https://toperbackend.herokuapp.com/project/loadproject/" + id)
        if(projectRs.status !== 200) return
        let rs = jsonToProject(projectRs.data)
        rs.ProjectDetail = projectRs.data.projectDetail
        return rs
    }
    return 
}

export const getLocalProjects = () => {
    let projectstr = localStorage.getItem("projects")
    if (projectstr === null) return []
    const projects: Project[] = JSON.parse(projectstr)
    return projects
}

export const removeLocalProject = (id:string , projects : Project[] = []) => {
    //projects = (projects.length === 0) ? getLocalProjects() : projects

}