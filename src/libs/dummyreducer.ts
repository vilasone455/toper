
import { createSlice , PayloadAction } from '@reduxjs/toolkit'



export interface TableData {
 tt : String
}

export const initialState : TableData = { tt : "",}

export const TableReducer = createSlice({
  name: 'dummy',
  initialState,
  reducers: {
    TestFunc: (state, action : PayloadAction<Boolean>) => {
      console.log('ff')
    },
  },
})

export const {
    TestFunc,
} = TableReducer.actions


export default TableReducer.reducer;