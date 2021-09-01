import React, { FunctionComponent, useEffect, useState } from 'react'



import {BrowserRouter as Router, Redirect, Route, useHistory } from 'react-router-dom'

import { Editor } from './pages/editor'

import {Document} from './pages/document'

import {SignIn} from './pages/signin'
import Cookies from 'js-cookie'
import { SignUp } from './pages/signup'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TestSeed from './TestSeed'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const App: FunctionComponent = () => {

	const isLoading = useSelector((state: RootState) => state.ShareReducer.isLoading);

	const isLogin = () => {
		console.log("check login from app")
		let token = Cookies.get("ertoken")
		if(token === "" || token === undefined) return false
		return true
	}

	return (
		<React.Fragment>

		<ToastContainer autoClose={2500} />

		<Backdrop open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

			<Router>

			<Route exact path="/testseed" component={TestSeed}/>

			<Route exact path="/signup" component={SignUp}/>

			<Route exact path="/login" component={SignIn}/>

			<Route exact path="/" component={Document} >
				{isLogin() ? <Redirect to="/document/filelist" /> : <Redirect to="/login" />}
				
			</Route>
			<Route  path="/document" component={Document} />
			<Route exact path="/editor/:projectId" component={Editor} />
			<Route exact path="/localeditor/:projectId" component={Editor} />
			<Route path="/share/:projectId" component={Editor} />
			</Router>

			

		</React.Fragment>

	);

}



