import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Container from '@material-ui/core/Container';

import {Sidebar} from '../components/Document/Sidebar'

import { MainHead } from "../components/Document/MainHead";
import { RootState } from "../store";
import { initApp } from "../reducer/loadapp";

import { FileList } from "../components/Document/FileList";

//import { ProjectForm } from "../components/Document/ProjectForm";
import { UserFrom } from "./userform";
import { ProjectForm } from "./projectform";

export default function ExTemplate() {
  return <div>Template</div>;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const Document: FunctionComponent = () => {


  const classes = useStyles();

  const addProjectModal = useSelector((state: RootState) => state.ProjectReducer.addProjectModal)

  const isFetch = useSelector((state: RootState) => state.ShareReducer.isFetch)

  const isLoading = useSelector(
    (state: RootState) => state.ShareReducer.isLoading
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if(!isFetch){
      dispatch(initApp());
    }
  }, []);

  return (

    <div className={classes.root}>

      
    <CssBaseline />
    <Sidebar/>
    <MainHead></MainHead>
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
    
          {/* Chart */}
          <Switch>
              <Route path="/document/filelist" component={FileList} />
              <Route path="/document/template" component={ExTemplate} />
              <Route path="/document/accout" component={UserFrom} />
              <Route path="/document/newproject" component={ProjectForm} />
              <Route path="/document/editproject/:id" component={ProjectForm} />
              
            </Switch>

        
      </Container>
    </main>
  </div>
    

  );
};
