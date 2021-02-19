
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
    menu : {
        marginRight : 10
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface ToolbarFunction {
  onExport : () => void,

}

export const AppToolbar: FunctionComponent<ToolbarFunction> = ({onExport }) => {
  const classes = useStyles();

  return (
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

          
   
      </div>
  
    </div>
  );
}


