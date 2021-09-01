import React, { FunctionComponent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { Project } from '../../interface/project'
import { deleteProjectAsync, deleteProjectLocal, fetchProjectAsync, fetchProjectLocal, newProjectAsync, newProjectLocal } from '../../reducer/project/thunkaction'
import { RootState } from '../../store'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { ConfrimDialog } from "../ConfrimDialog"
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

import Cookies from 'js-cookie'


import CloudQueueIcon from '@material-ui/icons/CloudQueue';

import FolderIcon from '@material-ui/icons/Folder';

import AirplayIcon from '@material-ui/icons/Airplay';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { DiagramMenu } from '../DiagramMenu'
import axios from 'axios'
import { DiagramModel } from '@projectstorm/react-diagrams'
import { getProjectDetailById } from '../../api/project'


export const FileList: FunctionComponent = () => {

  const history = useHistory()

  const dispatch = useDispatch()

  const [isConfrimModal, setisConfrimModal] = useState(false)

  const [currentSelect, setcurrentSelect] = useState("")

  const projects = useSelector((state: RootState) => state.ProjectReducer.projects)

  const projectSaveType = useSelector((state: RootState) => state.ProjectReducer.projectSaveType)

  const selectRemove = (id: string | undefined) => {
    if (id === undefined) id = ""
    setisConfrimModal(true)
    setcurrentSelect(id)
  }

  const confrimRemove = () => {
    alert(currentSelect)
    setisConfrimModal(false)
    if (currentSelect === "") return
    if(projectSaveType === "device"){
      dispatch(deleteProjectLocal(currentSelect))
    }else{
      dispatch(deleteProjectAsync(currentSelect))
    }
  }

  const switchSaveType = (type: string) => {
    if (type === "device") {
      dispatch(fetchProjectLocal())
    } else if (type === "cloud") {
      dispatch(fetchProjectAsync())
    }
  }

  const gotoEdit = (id: string | undefined) => {
    if (id === undefined) return ""
    let baseUrl = (projectSaveType === "cloud") ? "/editor" : "/localeditor"
    let url = baseUrl + "/" + id
    return url
  }

  const clickProjectMenus = (menu: string, id: string | undefined) => {
    if (id === undefined) return
    switch (menu) {
      case "Delete":
        selectRemove(id)
        break;
      case "Edit":
        history.push("/document/editproject/" + id)
        break;
      case "Make Template":
        makeTemplate(id)
        break;
      case "Clone":
        cloneDiagram(id)

        break;

      default:
        break;
    }
  }

  const cloneDiagram = async (id: string) => {
    let projectRs = await getProjectDetailById(projectSaveType, id)
    if (projectRs === undefined) return
    projectRs.ProjectName = "Clone-" + projectRs.ProjectName

    if (projectSaveType === "device") {
      await dispatch(newProjectLocal(projectRs))
    } else if (projectSaveType === "cloud") {
      await dispatch(newProjectAsync(projectRs))
    }
  }


  const makeTemplate = (id: string) => {

  }




  return (

    <Box display="flex">

      <Box p={1} flexGrow={1} >
        <h2>Open With</h2>
        <List>
          <ListItem button onClick={() => switchSaveType("cloud")} selected={projectSaveType === "cloud"}>
            <ListItemIcon>
              <CloudQueueIcon />
            </ListItemIcon>
            <ListItemText primary="Cloud" />
          </ListItem>
          <ListItem button onClick={() => switchSaveType("device")} selected={projectSaveType === "device"}>
            <ListItemIcon>
              <AirplayIcon />
            </ListItemIcon>
            <ListItemText primary="Device" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <OpenInBrowserIcon />
            </ListItemIcon>
            <ListItemText primary="Browse" />
          </ListItem>
        </List>

      </Box>

      <Divider orientation="vertical" flexItem style={{ height: "80vh" }} />

      <Box p={1} flexGrow={1} >
        <List>
          {projects.map((p: Project) => (
            <ListItem key={"editproject"+p.Id}>
              <Link to={() => gotoEdit(p.Id)}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
              </Link>

              <ListItemText
                primary={p.ProjectName}
                secondary={'Update at 10min ago'}
              />
              <ListItemSecondaryAction>

                <DiagramMenu onClickMenu={e => clickProjectMenus(e, p.Id)} />

              </ListItemSecondaryAction>
            </ListItem>

          ))}
          <ConfrimDialog isOpen={isConfrimModal} onClose={() => setisConfrimModal(false)} onConfrim={confrimRemove} />

        </List>
      </Box>



    </Box>



  )

}


export default FileList