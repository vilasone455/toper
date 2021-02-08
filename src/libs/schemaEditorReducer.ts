//import createEngine , { DiagramModel , DefaultNodeModel , DefaultLinkModel, DiagramEngine} from '@projectstorm/react-diagrams'
import { createSlice , PayloadAction } from '@reduxjs/toolkit'
//import createEngine , { DiagramModel , DefaultNodeModel , DefaultLinkModel, DiagramEngine} from '@projectstorm/react-diagrams'



function getData() : String{
    console.log("init func")
    return "Hello"
}

export interface SchemeEditorData {
  isOpen : Boolean,
  currentSelect : String
}

export const initialState : SchemeEditorData = {
  isOpen : false,
  currentSelect : getData()
}

export const SchemaEditorReducer = createSlice({
  name: 'schemaEditor',
  initialState,
  reducers: {
    OpenEditor: (state, action : PayloadAction<Boolean>) => {
      console.log("toggle : "+ action.payload)
      state.isOpen = action.payload 
    },
    NewNode:(state , action : PayloadAction<String>)=>{
      console.log("new node")

      
    },
    ToggleEditor : (state)=>{
      console.log('toggle')
        state.isOpen = !state.isOpen
        console.log(state.isOpen)
    },
    

  },
})

export const {
    NewNode,
    OpenEditor,
    ToggleEditor
} = SchemaEditorReducer.actions

export const isOpening = (state : SchemeEditorData) => state.isOpen
export const teststr = (state : SchemeEditorData) : String => {
    //console.log(state)
    return "uuu"
}
export default SchemaEditorReducer.reducer;