
import { Project } from "../../interface/project";
import { ProjectActionType, ProjectActionTypes, UpdateData } from "./type";

export function SetProject(data: Project[]): ProjectActionTypes {
    return {
      type: ProjectActionType.SET_PROJECT,
      payload: data
    }
}


export function UpdateProject(data: UpdateData<Project>): ProjectActionTypes {
  return {
    type: ProjectActionType.UPDATE_PROJECT,
    payload: data
  }
}

export function NewProject(data: Project): ProjectActionTypes {
  return {
    type: ProjectActionType.NEW_PROJECT,
    payload: data
  }
}

export function DeleteProject(id : string) : ProjectActionTypes{
  return {
    type : ProjectActionType.DELETE_PROJECT,
    payload : id
  }
}

export function ToggleModal(value : boolean) : ProjectActionTypes{
  return {
    type : ProjectActionType.TOGGLE_MODAL,
    payload : value
  }
}

export function ToggleConfrimModal(value : boolean) : ProjectActionTypes{
  return {
    type : ProjectActionType.TOGGLE_CONFRIM_MODAL,
    payload : value
  }
}

export function SetProjectSaveType(type : string) : ProjectActionTypes{
  return {
    type : ProjectActionType.SET_PROJECT_SAVE_TYPE,
    payload : type
  }
}
