import { createStore, combineReducers , applyMiddleware } from "redux";

import {AuthReducer} from "../reducer/auth/auth";

import {ShareReducer} from '../reducer/share/share'

import {ProjectReducer} from '../reducer/project/project'

import {themeReducer} from '../reducer/theme/theme'

import {alertReducer} from '../reducer/alert/alert'

import thunkMiddleware from 'redux-thunk'

const rootReducer = combineReducers({
	AuthReducer,
    ShareReducer,
    ProjectReducer,
    themeReducer,
    alertReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = () => {
	 return	createStore(rootReducer , applyMiddleware(thunkMiddleware));
}

const rsStore = store()

export default rsStore