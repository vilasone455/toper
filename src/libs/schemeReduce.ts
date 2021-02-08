import createEngine , { DiagramModel , DefaultNodeModel , DefaultLinkModel, DiagramEngine} from '@projectstorm/react-diagrams'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  fields : Field[]
}

export interface SchemaData {
  //engine ?: DiagramEngine,
  currentSelect : String,
  isOpen : Boolean,
  tables : Table[]
}



export const initialState : SchemaData = {
  currentSelect: "",
  isOpen : false,
  tables : [
    {
    table_name : "product",
    fields : [
      {field_name : "id" , type_name : "int", pk : true },
      {field_name : "product_name", type_name : "varchar",}
    ]
  },
  {
    table_name : "product_image",
    fields : [
      {field_name : "id" , type_name : "int" , pk : true},
      {field_name : "product_id" , type_name : "int" , fk_table : "product" , fk_field : "id"},
      {field_name : "url" , type_name : "varchar"}
    ]
  }]
}

export const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    initEngine:(state)=>{
      console.log("fff")
      console.log("fff")
      console.log(engine.getModel().getID())
      
      //engine.getModel().getc
      //state.engine = engine
    },
    testNode:(state)=>{
      console.log("test")
      //console.log(engine.getModel().getSelectionEntities())
    },
    newNode:(state , action : PayloadAction<String>)=>{
      console.log("new node")
      const name = action.payload.toString()
      const node =  new DefaultNodeModel(name , 'rgb(0,192,255)');
      node.addInPort("user_id")
      node.addOutPort("int")
      node.setPosition(50, 50);
      engine.getModel().addNode(node)
      
      engine.repaintCanvas()
    },
    addNode:(state , action : PayloadAction<Table>)=>{
      let tb_name = action.payload.table_name.toString()
      let node = new DefaultNodeModel(tb_name , 'rgb(0,192,255)')
      node.setPosition(50, 50);
      action.payload.fields.forEach(field => {
          let fname = field.field_name.toString()
          let tname = field.type_name.toString()
          node.addOutPort(fname)
          node.addInPort(tname)
      });
      engine.getModel().addNode(node)
      engine.repaintCanvas()
    },
    updateNode:(state , action : PayloadAction<UpdateData<Table>>)=>{
      let id = action.payload.id.toString()
      let tb = action.payload.value
      let tb_name = tb.table_name.toString()
      let node = new DefaultNodeModel(tb_name , 'rgb(0,192,255)')
      tb.fields.forEach(field => {
          let fname = field.field_name.toString()
          node.addOutPort(fname)
      });

      let cnode = engine.getModel().getNode(id)
      cnode = node
      engine.repaintCanvas()
    },
    deleteNode:(state , action : PayloadAction<String>)=>{
      let cnode = engine.getModel().getNode(action.payload.toString())
      engine.getModel().removeNode(cnode)
      engine.repaintCanvas()
    },


  },
})

export const {
    testNode,
    newNode,
    addNode,
    updateNode,
    deleteNode,
    initEngine
} = schemaSlice.actions

//export const getSchema = (state : SchemaData) => state.engine

export default schemaSlice.reducer;