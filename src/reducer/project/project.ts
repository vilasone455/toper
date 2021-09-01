
import { Project , defaultProjects  , defaultProject } from "../../interface/project"
import { ProjectActionTypes , ProjectActionType } from "./type"

interface ProjectState {
    projects : Project[],
    currentProject : Project,
    addProjectModal : boolean,
    confrimModal : boolean,
    projectSaveType : string
}

const initialState : ProjectState = {
    projects : defaultProjects(),
    currentProject : defaultProject(),
    addProjectModal : false,
    confrimModal : false,
    projectSaveType : ""
}

export const ProjectReducer = (state = initialState, action : ProjectActionTypes) => {
    switch (action.type) {

    case ProjectActionType.SET_PROJECT:
        return { ...state, projects : action.payload }
    case ProjectActionType.NEW_PROJECT:
        state.projects.push(action.payload)
        return { ...state }
    case ProjectActionType.UPDATE_PROJECT:
        let updateindex = state.projects.findIndex(p=>p.Id === action.payload.id)
        if(updateindex !== -1) state.projects[updateindex] = action.payload.data
        return { ...state }
    case ProjectActionType.DELETE_PROJECT:
        const indexof = state.projects.findIndex(p=>p.Id === action.payload)
        if(indexof !== -1) state.projects.splice(indexof , 1)
        return { ...state }

    case ProjectActionType.TOGGLE_MODAL:
        return { ...state , addProjectModal : action.payload }
    case ProjectActionType.TOGGLE_CONFRIM_MODAL:
        return { ...state , confrimModal : action.payload }
    case ProjectActionType.SET_PROJECT_SAVE_TYPE:
        return { ...state, projectSaveType : action.payload }

    default:
        return state
    }
}
