import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  defalutTab:{
    fontSize : 11
  },
  activetab:{
    //fontSize : 11,
    color: 'black',
    backgroundColor: 'white',
  }
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" TabIndicatorProps={{style: {background:'#FFFF'}}} style={{padding : 0}}>
          <Tab label="File" {...a11yProps(0)} style={{ minWidth: 50 , paddingTop : 0}} className={classes.activetab}  />
          <Tab label="Home" {...a11yProps(1)} style={{ minWidth: 50 , paddingTop : 0}}  />
          <Tab label="Account" {...a11yProps(2)} style={{ minWidth: 50 , paddingTop : 0}}  />
        </Tabs>
      </AppBar>
     
    </div>
  );
}