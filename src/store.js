import { configureStore } from '@reduxjs/toolkit';


import SchemaEditor from './libs/schemaEditorReducer'

import SchemaReducer from './libs/schemeReduce'
import TableReducer from './libs/tablereducer'
import Dummay from './libs/dummyreducer'
export default configureStore({
  reducer: {
    
    dummy : Dummay,
    tablereducer : TableReducer
  },
});