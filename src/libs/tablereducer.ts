//import createEngine , { DiagramModel , DefaultNodeModel , DefaultLinkModel, DiagramEngine} from '@projectstorm/react-diagrams'
import { DefaultNodeModel } from '@projectstorm/react-diagrams'
import { createSlice , PayloadAction } from '@reduxjs/toolkit'
//import createEngine , { DiagramModel , DefaultNodeModel , DefaultLinkModel, DiagramEngine} from '@projectstorm/react-diagrams'
import {engine} from '../libs/engine'

export interface Field{
    field_name : String
    type_name : String,
  
    pk ?: Boolean,
    fk_table ?: String,
    fk_field ?: String
  }
  
  export interface UpdateData<T> {
    id : String,
    value : T
  }
  
  export interface Table {
    table_name : String,
    node_id : String,
    fields : Field[]
  }
  



export interface TableData {
 tt : String
 openstate : Boolean,
 currentSelect : String,
 tables : Table[]
}

export const initialState : TableData = {
    tt : "",
    openstate : false,
    currentSelect : "",
    tables : []
}

export const TableReducer = createSlice({
  name: 'tablereducer',
  initialState,
  reducers: {
    NewNode : (state , action : PayloadAction<Table>)=>{
      const node1 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
      node1.setPosition(400, 100);
      engine.getModel().addNode(node1)
      engine.repaintCanvas()
    },
    OpenEditor: (state, action : PayloadAction<Boolean>) => {
      console.log("toggle : "+ action.payload)
      let selectnodes = engine.getModel().getSelectedEntities()
      if(selectnodes.length == 0) return
      let nodeid = selectnodes[0].getID()
      console.log("open : "+nodeid)
      state.openstate = true
      state.currentSelect = nodeid
      //let schema = FindSchemaByNodeId(nodeid)
      //LoadFormEditor(schema)
    },

    

  },
})

export const {
    NewNode,
    OpenEditor,

} = TableReducer.actions

export function FindSchemaById(id : string , tables : Table[]) : Table{
    let indexof = tables.findIndex(t=>t.node_id === id)
    let tb : Table = {
        table_name : "",
        node_id : "",
        fields : []
    }
    if(indexof != -1){
        tb = tables[indexof]
    }
    return tb
}

export const teststr = (state : TableData) : String => {
    //console.log(state)
    return "uuu"
}
export default TableReducer.reducer;