import { combineReducers } from '@reduxjs/toolkit'

import schemaEditorReducer from './libs/schemaEditorReducer'
import schemeReducer from './libs/schemeReduce'

const rootReducer = combineReducers({
    schemaEditorReducer,
    schemeReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer