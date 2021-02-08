
import React , {FunctionComponent} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button  from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,

    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

export const NavEditor: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" >
            Visual Draw
            
          </Typography>
          <Divider orientation="vertical" flexItem style={{marginLeft:20}} />
          <Button >File</Button>
          <Button>Export</Button>
          <Button>Print</Button>
          <Button>Help</Button>
          <Typography className={classes.title}></Typography>
          <Button variant="contained" color="primary">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}


