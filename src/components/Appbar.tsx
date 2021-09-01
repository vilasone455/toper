import React , {FunctionComponent, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { MenuButton } from './MenuButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 0,
    },
    inputEdit : {
      backgroundColor : "#3F51B5",
      padding : 8,
      color : "white",
      border: "none",
      borderRadius: 4,
      fontSize : 20

 
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface AppbarProp {
  title : string,
  onDelete : () => void,
  onEndEdit : (e : string) => void,
  tables : any[],
  onSelectTable : (id:string) => void
}

export const  Appbar : FunctionComponent<AppbarProp> = ({onSelectTable,  onDelete , title , onEndEdit, tables }) => {
  const classes = useStyles();

  const [isEdit, setisEdit] = useState(false)

  const [textInput, settextInput] = useState("")

  function handleChange(e : any){
    settextInput(e.target.value)
  }

  function handleBlur(){
    setisEdit(!isEdit)
    
    onEndEdit(textInput)
  }



  function handleOpenEdit(){
    setisEdit(true)
    settextInput(title)
  }

  function onSendSelectEvent(id:string){
    onSelectTable(id)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0} >
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuButton menuName="" isEnable={true} items={tables} onClickMenu={onSendSelectEvent}>
              <SwapVertIcon/>
            </MenuButton>
          </IconButton>
          {(isEdit) ? 
           <input value={textInput} onChange={handleChange} onBlur={ handleBlur} className={classes.inputEdit} />
          :
          <Typography  variant="h6" className={classes.title} onClick={handleOpenEdit}>
            {title}
          </Typography>
          }
          <IconButton color="inherit" onClick={onDelete}><DeleteOutlineIcon/></IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}