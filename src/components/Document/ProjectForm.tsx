import React ,  { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Modal } from "semantic-ui-react";
import { Project } from "../../interface/project";
import { newProjectAsync } from "../../reducer/project/thunkaction";
import { RootState } from "../../store";

interface ProjectForm {
    isOpen : boolean
}

export const ProjectForm: FunctionComponent<ProjectForm> = ({isOpen}) => {

    const [projectName, setprojectName] = useState("")

    const [projectDescription, setprojectDescription] = useState("")

    const user = useSelector((state : RootState) => state.AuthReducer.user)

    const dispatch = useDispatch()

    const onSave = () => {
        let project : Project = {
            ProjectName : projectName,
            ProjectDescription : projectDescription,
            ProjectDetail : "",
            VisibleStatus : 1,
            UserId :  user._id,
            ShareUrl : ""
        }
        dispatch(newProjectAsync(project))
    }

        return (
            <Modal open={isOpen}>
                <Form>
                <input type="text" placeholder="Project name" value={projectName} 
                onChange={(e) => setprojectName(e.target.value)} />
                <input type="text" placeholder="Project Description" value={projectDescription}
                onChange={(e) => setprojectDescription(e.target.value)} />
                <Button onClick={onSave}>Save</Button>
            </Form>
            </Modal>
            
        )


    
}