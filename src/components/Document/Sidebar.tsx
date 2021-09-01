import { FunctionComponent } from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import {  Box} from "@material-ui/core"
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    
  },
  toolbar: {

    ...theme.mixins.toolbar
  },

  avatarIcon : {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

    drawerPaper: {
      backgroundColor : "#5661B3",
    color : "white",

        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
      },

}));

export const Sidebar: FunctionComponent = () => {

    const classes = useStyles();

    const user = useSelector((state:RootState) => state.AuthReducer.user)

    const history = useHistory();

    const changePath = (p : string) => {
      
      history.push("/document/"+p)
    }

    return (
        <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"

      >
        <div className={classes.toolbar}>
          <Box display="flex" flexDirection="column" alignItems="center">

          <Avatar alt="Remy Sharp" 
          style={{marginTop:20 }} className={classes.avatarIcon} >
            <AccountCircleIcon style={{fontSize:70}}></AccountCircleIcon>
            </Avatar>
          <Typography style={{margin:14 , fontSize:20}}>{user.userName}</Typography>

          <hr style={{width:200}}></hr>

          </Box>
        
        </div>
     
        <List>
        <div>
        <ListItem button onClick={() => changePath("newproject")}>
            <ListItemIcon>
              <AddCircleOutlineOutlinedIcon color="inherit" style={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="New Project" />
          </ListItem>
          <ListItem button onClick={() => changePath("filelist")}>
            <ListItemIcon>
              <DashboardIcon color="inherit" style={{color:"white"}}  />
            </ListItemIcon>
            <ListItemText primary="File List" />
          </ListItem>
          <ListItem button onClick={() => changePath("filelist")}>
            <ListItemIcon color="transparent">
              <ShoppingCartIcon style={{color:"white"}}  />
            </ListItemIcon>
            <ListItemText primary="Template"  />
          </ListItem>
          <ListItem button onClick={() => changePath("accout")}>
            <ListItemIcon>
              <PeopleIcon style={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
 
          <ListItem button onClick={() => changePath("accout")}>
            <ListItemIcon>
              <LayersIcon style={{color:"white"}} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </div>
        </List>
  
      </Drawer>
        
      )
}