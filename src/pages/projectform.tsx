import { Button, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultProject, Project } from "../interface/project";
import { RootState } from "../store";
import { newProjectAsync, newProjectLocal, updateProjectAsync } from "../reducer/project/thunkaction";
import { useHistory } from "react-router-dom";
import { useParams , useLocation} from 'react-router';
import { EditorParamType } from '../pages/editor';
import { v4 as uuidv4 } from 'uuid';


export const ProjectForm : FunctionComponent = () => {

    let pid = ""
    
    const [projectId, setprojectId] = useState("")

    const projectSaveType = useSelector((state:RootState) => state.ProjectReducer.projectSaveType)

    const userId = useSelector((state:RootState) => state.AuthReducer.user._id)

    const projects = useSelector((state:RootState) => state.ProjectReducer.projects)

    const [currentProject, setcurrentProject] = useState(defaultProject())

    const location = useLocation()

    const history = useHistory()

    const dispatch = useDispatch()

    const [ProjectName, setProjectName] = useState("")

    const [ProjectDescription, setProjectDescription] = useState("")

    const user = useSelector((state : RootState) => state.AuthReducer.user)

    useEffect(() => {
        initProject()
    }, [])

    function initProject(){
        let str = location.pathname.split("/")
        
        if(str.length = 4){
            pid = str[3]
            setprojectId(pid)

            let projectdata = projects.find(p=>p.Id === pid)
            if(projectdata !== undefined) {
                setcurrentProject(projectdata)
                alert("set project " + JSON.stringify(projectdata))
                setProjectName(projectdata.ProjectName)
                setProjectDescription(projectdata.ProjectDescription)
            }
        }
        
    }

    const onSave = () =>  {

        currentProject.UserId = userId
        currentProject.ProjectName = ProjectName
        currentProject.ProjectDescription = ProjectDescription

        if(projectId ===  undefined || projectId === ""){
            if(projectSaveType === "device"){
                console.log('add device')
                currentProject.Id = uuidv4()
                dispatch(newProjectLocal(currentProject))
            }else if(projectSaveType === "cloud"){
                console.log("add cloud")
                dispatch(newProjectAsync(currentProject))
            }
            
        }else{
            dispatch(updateProjectAsync(currentProject , projectId))
        }
        history.push("/")
    }

    const test = () => {
        let project : Project = {
            ProjectName : ProjectName,
            ProjectDescription : ProjectDescription,
            ProjectDetail : "",
            VisibleStatus : 1,
            UserId :  user._id,
            ShareUrl : ""
        }
        
        dispatch(newProjectAsync(project))

        history.push("/document/filelist")
    }

    return (
        <Box flexGrow={1}>

            <TextField label="Project Name" value={ProjectName} 
                onChange={(e) => setProjectName(e.target.value)} fullWidth style={{ margin: 8 }} />
            <TextField label="Project Description" value={ProjectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)} fullWidth style={{ margin: 8 }} />
            <TextField label="Create Date" disabled fullWidth style={{ margin: 8 }} />
            <TextField label="Update Date" disabled fullWidth style={{ margin: 8 }} />
            <Button onClick={onSave} style={{ margin: 8 }}>Save Project</Button>
        </Box>
    )
}