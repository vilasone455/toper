
import * as _ from 'lodash';

//import ClipboardAction from './actions/ClipboardAction';
import DeleteAction from './actions/DeleteAction';
import NewNodeAction from './actions/NewNodeAction';
import DuplicateAction from './actions/DuplicateAction';
//import UndoRedoAction from './actions/UndoRedoAction';
import ZoomAction from './actions/ZoomAction';
import ClipboardAction from './actions/Clipboard'
import { Action } from '@projectstorm/react-canvas-core';

import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GetEngine } from '../libs/engine'
import { SchemaNodeModel } from '../schemanode/node/SchemaNodeModel';
import { TableData } from '../components/TableEditor';
import { Field } from '../schemanode/node/SchemaNodeModel'

export class DiagramController {

  isLock: boolean;
  engine: DiagramEngine

  constructor() {
    this.isLock = false
    this.engine = GetEngine()

    this.initActions()

    console.log(this.getEngine().getModel().getZoomLevel())

    let links = this.getEngine().getModel().getLinks()

    let models = this.getEngine().getModel().getModels()

    console.log(links)

    //let p1= links[0].getTargetPort()
    //let nodemd = p1.getNode() as SchemaNodeModel

    //links[0].remove()

    //this.getEngine().repaintCanvas()

    //alert(nodemd.getOptions().name)
    //console.log(p1)
  }



  initActions() {


    let actions: Action[] = [
      new DeleteAction(true),
      new NewNodeAction(true),
      new DuplicateAction(true),
      new ClipboardAction(true)

    ]

    actions.forEach(Action =>
      this.engine
        .getActionEventBus()
        .registerAction(Action),
    );

  }

  fireAction(event: any) {
    this.engine.getActionEventBus().fireAction({
      event: {
        ...event,
        key: '',
        preventDefault: () => { },
        stopPropagation: () => { },
      },
    });
  }


  currentNode(): SchemaNodeModel | undefined {
    let entities = this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => !model.isLocked());

    if (entities.length == 0) return undefined

    let node = entities[0]

    if (node instanceof SchemaNodeModel === false) return undefined

    let rs = node as SchemaNodeModel

    return rs
  }

  getAllTable(): TableData[] {
    let rs: TableData[] = []
    let alltb = this.getEngine().getModel().getNodes() as SchemaNodeModel[]
    alltb.forEach(tb => {
      let name = tb.getOptions().name
      if (name == undefined) name = ""
      let add: TableData = {
        id: tb.getID(),
        tablename: name,
        fields: tb.getAllField()
      }
      rs.push(add)
    });
    return rs
  }

  getCurrentTable() : TableData{
    let rs: TableData = {
      id: "",
      tablename: '',
      fields: []
    }
    let node = this.currentNode()

    if (node == undefined) return rs

    if (node instanceof SchemaNodeModel) {
      let nodedata = node as SchemaNodeModel
      let tbname = nodedata.getOptions().name
      if (tbname === undefined) tbname = ""
      rs.tablename = tbname
      rs.id = nodedata.getID()
      rs.fields = nodedata.getAllField()
    }

    return rs
  }

  linktest() {
    this.linkNode()
  }

  linkNode() {
    let nodes = this.getEngine().getModel().getNodes() as SchemaNodeModel[]
    alert(nodes[1].getOptions().name)
    let sourcePort = nodes[0].getOutPorts()[0]
    let targetPort = nodes[1].getInPorts()[0]


    let link = sourcePort.link(targetPort)

    targetPort.reportPosition()
    sourcePort.reportPosition()

    this.getEngine().getModel().addAll(link);
    this.getEngine().repaintCanvas()
  }

  updateNodeName(e: string) {
    let node = this.currentNode()
    if (node == undefined) return
    node.getOptions().name = e
    this.getEngine().repaintCanvas()
  }

  linkModel(targetNodeId: string,
    targetNodeField: string, mainNodeField: string,) {
    let node = this.currentNode()
    if (node == undefined) return
    let targetNode = this.engine.getModel().getNode(targetNodeId) as SchemaNodeModel
    let link = node.linkForeignKey(targetNode, targetNodeField, mainNodeField)
    if (link == undefined) return
    this.engine.getModel().addAll(link)
    this.engine.repaintCanvas()
  }

  setCurrentNode(node: SchemaNodeModel) {
    this.engine.repaintCanvas()
  }

  updateNode(tb: TableData) {
    let node = this.currentNode()

    if (node == undefined) return

    node.updateNode(tb)

    this.getEngine().repaintCanvas()

  }

  testEdit() {

    let node = this.currentNode()

    let tb = {
      tablename: "top",
      fields: [{
        fieldName: "Id",
        fieldType: "int"
      }, {
        fieldName: "ProductId",
        fieldType: "varchar"
      }, {
        fieldName: "Id",
        fieldType: "int"
      }
      ]
    }

    if (node == undefined) return

    node.updateNode(tb)

    this.getEngine().repaintCanvas()

  }

  doZoom(value : number){
    let model = this.getEngine().getModel()
    let zoomLevel = model.getZoomLevel()
    console.log(zoomLevel)
    model.setZoomLevel(zoomLevel + value)
    this.getEngine().repaintCanvas()
  }

  updateFieldOption(f: Field) {
    let node = this.currentNode()
    if (node == undefined) return
    node.addOrUpdateFieldOption(f)
  }


  copySelected = () => {
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyC' });

  }

  newNode() {
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyB' });
  }

  duplicateSelected = () => {
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyD' });
  }

  cutSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyX' });


  pasteSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyV' });

  deleteSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'Delete' });

  undo = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyZ' });

  zoomIn(event: any) {
    this.fireAction({
      clientX: event.clientX,
      clientY: event.clientY,
      type: 'wheel',
      deltaY: +1,
    });
  }

  zoomOut(event: any) {
    this.fireAction({
      clientX: event.clientX,
      clientY: event.clientY,
      type: 'wheel',
      deltaY: -1,
    });
  }



  getEngine(): DiagramEngine {
    return this.engine
  }



}