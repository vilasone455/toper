
import React , {FunctionComponent, useEffect} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import IconButton from '@material-ui/core/IconButton';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';

import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import Avatar from '@material-ui/core/Avatar';
import {MenuButton} from './MenuButton'
import {FileMenu , EditMenu, ThemeMenu , ExportMenu, HelpMenu} from '../data/menus'
import { useHistory } from "react-router-dom";
import {OnImport} from '../api/import/sqlimport'
import { DiagramController } from '../DiagramController/DiagramCtr';
import { useLocation, useParams } from 'react-router';
import { EditorParamType } from '../pages/editor';
import Cookies from 'js-cookie';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,

    },
    avatarIcon : {
      cursor : "pointer",
      width : 25,
      height : 25,
      backgroundColor : "orange",
      marginRight : 20
    },
    title: {
      flexGrow: 1,

    },
    menu : {
        marginRight : 10
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menubtn: {
      color : "white" ,
      textTransform : "capitalize",
      marginRight : 25 ,
      cursor: "pointer"
    },
  }),
);

enum ExportType{
  Image = "imageexportmenu",
  Database = "dbexportmenu"
}

interface ToolbarFunction {
  isDark : boolean,
  diagram : DiagramController,
  onExport : (exportType : string) => void,
  onSave : () => void,
  onSelectChange : boolean,
  onOpenMenu : (menuname:string) => void
}


export const AppToolbar: FunctionComponent<ToolbarFunction> = ({isDark,onOpenMenu,diagram,onExport , onSave, onSelectChange }) => {
  const classes = useStyles();

  let { projectId } = useParams<EditorParamType>();

  const history = useHistory();

  const location = useLocation()


  
  const isApiLoading = useSelector((state : RootState ) => state.ShareReducer.isLoading)

  useEffect(() => {
    //alert("select change" + onSelectChange)
  }, [onSelectChange])

  function loadOpenFile() {
		var elem = document.getElementById("fileimport");
		if (elem && document.createEvent) {
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, false);
			elem.dispatchEvent(evt);
		}
	}

  function onLoadFile(e: any) {
		var input = e.target;
		var reader = new FileReader();
		reader.onload = (es) => {
			let text = reader.result as string;
      if(text === null){
        text = ""
      }
      OnImport(text)
			e.target.value = null
		};
		reader.readAsText(input.files[0]);
	}

  function onExportMenu(id:string){
    onExport(id)
  }

  function onFileMenu(id:string){
    switch (id) {
      case "importmenu":
        loadOpenFile()
        break;
      case "openmenu":
        history.push("/document/filelist")
        break;
      case "newmenu":
        history.push("/document/newproject")
        break;
      case "propertiemenu":
        history.push("/document/editproject/" + projectId)
        break;
      case "importmenu":
        //onOpenMenu(id)
        break;
      case "exportmenu":
        onOpenMenu(id)
        break;
      case "sharemenu":
        onOpenMenu(id)
        break;
      case "seedmenu":
        onOpenMenu(id)
        break;
    
      default:
        break;
    }
  }

  function onEditMenu(id:string){
    switch (id) {
      case "copymenu":
        diagram.copySelected()
        break;
      case "cutmenu":
        diagram.cutSelected()
        break;
      case "deletemenu":
        diagram.deleteSelected()
        break;
      case "duplicatemenu":
        diagram.duplicateSelected()
        break;
      case "undomenu":
        loadOpenFile()
        break;
      case "redomenu":
        loadOpenFile()
        break;
      default:
        break;
    }
  }

  function onHelpMenu(menu : string) {
    if(menu === "shortcutmenu"){
      onOpenMenu(menu)
      return
    }
    let urlmap : any = {
      "aboutmenu" : "https://toperlanding.netlify.app/",
      "contactmenu" : "https://toperlanding.netlify.app/contact.html",
      "changelog" : "https://toperlanding.netlify.app/contact.html"
    }
    let linkurl = urlmap[menu]
    openLink(linkurl)
  }

  function onThemeChange(menu : string){

    if(menu === "") return

    let darkstate = (menu === "lightmenu") ? "false" : "true"

    Cookies.set("darkmode" , darkstate)

    alert("please reload page for change mode")

  }

  function openLink(linkname:string){
    let win = window.open(linkname, '_blank');
    if(win === null) return
    win.focus();
  }
  

  return (
    <AppBar position="static" color={(isDark) ? "secondary" : "primary"}>
    <Toolbar variant="dense" >
    <Avatar variant="rounded" src="/img/erlogo.svg" className={classes.avatarIcon} />

      <MenuButton className={classes.menubtn} isEnable={true} items={FileMenu} menuName="File" onClickMenu={onFileMenu} />

      <MenuButton className={classes.menubtn} isEnable={onSelectChange} items={EditMenu} menuName="Edit" onClickMenu={onEditMenu} />

      <MenuButton className={classes.menubtn} isEnable={true} items={ExportMenu} menuName="Export" onClickMenu={onExportMenu} />

      <MenuButton className={classes.menubtn} isEnable={true} items={ThemeMenu} menuName="Theme" onClickMenu={onThemeChange}  />
   
      <MenuButton className={classes.menubtn} isEnable={true} items={HelpMenu} menuName="Help" onClickMenu={onHelpMenu}  />

      <span className={classes.title}></span>

      <input type="file" id="fileimport" style={{ display: "none" }} onChange={onLoadFile} />
      <a target="_blank" href="https://forms.gle/U5oyXvAbqxypZDFR9">
      <Button variant="outlined" style={{marginLeft:15}} color="inherit" 
      startIcon={<FeedbackOutlinedIcon/>} >Feedback</Button>
      </a>
      
            <Button variant="outlined" style={{marginLeft:15}} color="inherit" 
            startIcon={(isApiLoading ? <CircularProgress style={{width:20,height:20}} 
            color={"inherit"} /> : <SaveIcon/> )} onClick={onSave}>Save</Button>
                  <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
    </Toolbar>
  </AppBar>
  );
}

 /*
    <div className={classes.root}>
      <div style={{height : 30,marginLeft : 20 }}>
 
          <Typography variant="h6" color="inherit" >
            Visual Draw
            
          </Typography>
          
      </div>
      <div style={{height : 40}}>
 
          
      <Button>File</Button>
          <Button onClick={onExport}>Export</Button>
          <Button> Print</Button>
          <Button>Help</Button>
          <Typography className={classes.title}></Typography>

          {isApiLoading ? <div>Saving....</div> : ""}
   
      </div>
  
    </div>
    */

