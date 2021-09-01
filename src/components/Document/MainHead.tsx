import React, { FunctionComponent } from 'react'
import {  useDispatch, useSelector } from 'react-redux'

import { signOut } from '../../reducer/auth/thunkaction';
import { useHistory } from "react-router-dom";
import {RootState} from '../../store/index'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },

  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  menuButton: {
    marginRight: 36,
  },

  title: {
    flexGrow: 1,
  },



}));

export const MainHead: FunctionComponent = () => {

    const history = useHistory();

    const user = useSelector((state: RootState) => state.AuthReducer.user);

    const dispatch = useDispatch()

    const classes = useStyles();

    const onLogOut = async () => {
        await dispatch(signOut())
        history.push("/login")
    }

    return (
      <AppBar  className={classes.appBar} elevation={0} position="fixed" color="transparent"  >
      <Toolbar className={classes.toolbar} >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          Dashboard
        </Typography>
        <IconButton color="inherit" onClick={onLogOut}>
          
            <ExitToAppIcon />
        
        </IconButton>
      </Toolbar>
    </AppBar>

    )

}


export default MainHead
