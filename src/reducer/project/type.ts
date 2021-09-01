import { Project } from "../../interface/project";

export enum ProjectActionType {
    SET_PROJECT = "SET_PROJECT",
    UPDATE_PROJECT = "UPDATE_PROJECT",
    NEW_PROJECT = "NEW_PROJECT",
    DELETE_PROJECT = "DELETE_PROJECT",
    TOGGLE_MODAL = "TOGGLE_MODAL",
    TOGGLE_CONFRIM_MODAL = "TOGGLE_CONFRIM_MODAL",
    SET_PROJECT_SAVE_TYPE = "SET_PROJECT_SAVE_TYPE",
}

export interface UpdateData<T>{
    id : string,
    data : T
}

interface SetProjectAction {
    type: typeof ProjectActionType.SET_PROJECT
    payload: Project[]
}

interface UpdateProjectAction {
    type: typeof ProjectActionType.UPDATE_PROJECT
    payload: UpdateData<Project>
}

interface NewProjectAction {
    type : typeof ProjectActionType.NEW_PROJECT,
    payload : Project
}

interface DeleteProjectAction {
    type : typeof ProjectActionType.DELETE_PROJECT,
    payload : string
}

interface ToggleAddModal{
    type : typeof ProjectActionType.TOGGLE_MODAL,
    payload : boolean
}

interface ToggleConfrimModal{
    type : typeof ProjectActionType.TOGGLE_CONFRIM_MODAL,
    payload : boolean
}

interface SetProjectSaveType{
    type : typeof ProjectActionType.SET_PROJECT_SAVE_TYPE,
    payload : string
}



  
export type ProjectActionTypes = SetProjectAction  | UpdateProjectAction | NewProjectAction | 
DeleteProjectAction | ToggleAddModal | ToggleConfrimModal | SetProjectSaveType