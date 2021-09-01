
import * as _ from 'lodash';

//import ClipboardAction from './actions/ClipboardAction';
import DeleteAction from './actions/DeleteAction';
import NewNodeAction from './actions/NewNodeAction';
import DuplicateAction from './actions/DuplicateAction';
//import UndoRedoAction from './actions/UndoRedoAction';
import ZoomAction from './actions/ZoomAction';
import ClipboardAction from './actions/Clipboard'
import { Action } from '@projectstorm/react-canvas-core';

import { DefaultLabelModel, DefaultLinkModel, DefaultPortModel , DiagramEngine, DiagramModel, LabelModel, LinkModel, PathFindingLinkFactory } from '@projectstorm/react-diagrams';
import { GetEngine } from '../libs/engine'

import { TableData } from '../components/TableEditor';
import { SchemaNodeModel, Field } from '../schemanode/node/SchemaNodeModel';
import { SchemaLinkModel } from '../schemanode/link/SchemaLinkModel';
import { SchemaPortModel } from '../schemanode/port/SchemaPortModel';
import { tables } from '../data/testdiagramdata';
import { Relation } from '../interface/Relation';

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

  removeLinkbyPort(inPort : SchemaPortModel , outPort : SchemaPortModel){
    const linksIn = inPort.getLinks()
    const linksOut = outPort.getLinks()
    this.removeLink(linksIn , inPort)
    this.removeLink(linksOut , outPort)
  }

  removeLink(links : {[id:string] : LinkModel} , port : SchemaPortModel){
    let linkLenght = Object.keys(links).length;
    if(linkLenght >= 1){
      for (const key in links) {
        if(links[key].getSourcePort().getID() === port.getID()){
          links[key].remove()
          this.getEngine().repaintCanvas()
          break
        }  
      }
    }
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

  findSourcesLinkInPort(port : SchemaPortModel) : LinkModel[]  {
    let rs = []
    let links = port.getLinks()
    let portId = port.getID()
    for (const key in links) {
      if (Object.prototype.hasOwnProperty.call(links, key)) {
        if(links[key].getSourcePort().getID() === portId){
          rs.push(links[key])
        }
      }
    }
    return rs
  }

  connectRealation(selectPort : SchemaPortModel,selectPortOut : SchemaPortModel,relationName : string){

    const linksIn = this.findSourcesLinkInPort(selectPort)

    if(linksIn.length > 0){
      this.setRelationLink(linksIn[0] as SchemaLinkModel , relationName)
      return
    }

    const linksOut = this.findSourcesLinkInPort(selectPortOut)

    if(linksOut.length > 0){
      this.setRelationLink(linksOut[0] as SchemaLinkModel , relationName)
      return
    }
    
  }

  setRelationLink(link : SchemaLinkModel,relationName : string){
    link.setLabels([])   
    link.addLabel(relationName)
    this.getEngine().repaintCanvas()
  }

  saveDataByString(data : string){
    const model2 = new DiagramModel()
    if(data !== ""){
      const model = JSON.parse(data)
      let obj: ReturnType<DiagramModel['serialize']> = model
      
      model2.deserializeModel(obj, this.getEngine())
        if (model2 == null) {
          console.log("model null")
          return
        }
    }

			this.getEngine().setModel(model2)

      this.registerLinkEvent()
  }

  registerLinkEvent(){
    this.getEngine().getModel().registerListener({
      linksUpdated: (e:any ) => this.isCompleteLink(e),
      selectionChanged : (e:any) => {console.log(e)}
    })
    
  }

  isCompleteLink(e:any){
    console.log("create link")
    const link : DefaultLinkModel = e.link
    let sourcePort = link.getSourcePort() as SchemaPortModel
    let node = sourcePort.getNode() as SchemaNodeModel
    let mirrorPort = node.mirrorPort(sourcePort)
    if(mirrorPort === undefined) return
    console.log(mirrorPort.getOptions().label)
    let sourceLinkArr = this.findSourcesLinkInPort(mirrorPort)
    console.log(sourceLinkArr)
    if(sourceLinkArr.length > 0){
      alert("error one field can have only one foreign key")
      link.remove()
      this.getEngine().repaintCanvas()
    }

    link.registerListener({
      targetPortChanged:(ev : any) => this.toggleFk(ev)
    })

    //let node = this.currentNode()
    //if(node === undefined) return 
    //node.set
  }

  toggleFk(ev : any){
    let linkmodel : DefaultLinkModel = ev.entity
    let port = linkmodel.getSourcePort() as SchemaPortModel
    let node = port.getNode() as SchemaNodeModel
    let links = this.findSourcesLinkInPort(port)
    if(links.length > 1 ){
      links[0].remove()
      this.getEngine().repaintCanvas()
    }
    node.setNodeOption(port.getID())
  }

  direactionNode(node1 : SchemaNodeModel , node2 : SchemaNodeModel){
    console.log(node1.getOptions().name)
    console.log(node2.getOptions().name)
    let x1 = node1.getPosition().x
    let x2=  node2.getPosition().x

    console.log("x1=" + x1 +  " x2=" + x2) 
    const dir = (x1 <= x2) ? "front" : "back"
    return dir
  }

  getNodeById(id : string){
    return this.getEngine().getModel().getNode(id) as SchemaNodeModel
  }

  clearDiagram(){
    const modelset = new DiagramModel()
    this.getEngine().setModel(modelset)
    this.registerLinkEvent()
    this.getEngine().repaintCanvas()
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

  linkModel(sourcePort : SchemaPortModel , targetPort: SchemaPortModel) {

    let sourceLink = this.findSourcesLinkInPort(sourcePort)

    if(sourceLink.length > 0){
      sourceLink[0].remove()
    }

    let link =  sourcePort.link<SchemaLinkModel>(targetPort )
		sourcePort.reportPosition()
		targetPort.reportPosition()

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

  zoomPercent(value : number){
    let model = this.getEngine().getModel()
    model.setZoomLevel(value)
    this.getEngine().repaintCanvas()
  }

  doZoom(value : number){
    let model = this.getEngine().getModel()
    let zoomLevel = model.getZoomLevel()
    console.log("zoom level : "+zoomLevel)
    model.setZoomLevel(zoomLevel + value)
    this.getEngine().repaintCanvas()
  }

  zoomFit = () =>{
    console.log("zoom fit")
    this.getEngine().zoomToFit()
  }

  updateFieldOption(f: Field) {
    let node = this.currentNode()
    //if (node == undefined) return
    node?.addOrUpdateFieldOption(f)
  }

  createDiagramWithSchemaTable(tables : TableData[]){
    let model = new DiagramModel()
    let nodes : SchemaNodeModel[] = []

    let spaceCol = 250
    let spaceRow = 200
    let curCol = 0
    let maxCol = 6
    alert(spaceCol)
    tables.forEach(tb => {
      let node = new SchemaNodeModel()
      node.getOptions().name = tb.tablename
      let nodeTotal = nodes.length
      let posX = 0
      let posY = 50
      if(nodeTotal > 0){
        alert(nodeTotal + 1 + "tb")
        let point = nodes[nodeTotal-1].getPosition()
        posX = point.x
        posX += spaceCol
        posY = point.y
        if(curCol === maxCol){
          posX = 0
          curCol = 0
          posY += spaceRow
        }
        alert("current col : " + curCol)
        
      }

      alert(posX + "and" + posY)

      node.setPosition(posX  , posY)
      
      this.createPorts(node,tb.fields)
      
      curCol += 1
      nodes.push(node)
    });
    model.addAll(...nodes)
    this.getEngine().setModel(model)
    this.registerLinkEvent()
    this.getEngine().repaintCanvas()
  }

  getRelationData() : Relation[]{
    let rs : Relation[] = []
    let links = this.getEngine().getModel().getLinks()
    links.forEach(link => {
      let targetField = ""
      let mainField = ""
      let sourcePort = link.getSourcePort() as SchemaPortModel
      let targetPort = link.getTargetPort() as SchemaPortModel
      let targetNode = targetPort.getNode() as SchemaNodeModel
      let sourceNode = sourcePort.getNode() as SchemaNodeModel

      if(sourcePort.getOptions().in){ // in to out => in to in
        let mainFieldData = sourcePort.getOptions().label
        mainField = (mainFieldData !== undefined) ? mainFieldData : ""
        let mirrorTargetPort = targetNode.mirrorPort(targetPort) 
        if(mirrorTargetPort !== undefined){
          let targetFieldData = mirrorTargetPort.getOptions().label
          targetField = (targetFieldData !== undefined) ? targetFieldData : ""
        }
      }

      if(sourcePort.getOptions().in === false){  // out to in => in to in
        let targetFieldData = targetPort.getOptions().label
        targetField = (targetFieldData !== undefined) ? targetFieldData : ""

        let mirrorSourcePort = sourceNode.mirrorPort(sourcePort) 
        if(mirrorSourcePort !== undefined){
          let mainFieldData = mirrorSourcePort.getOptions().label
          mainField = (mainFieldData !== undefined) ? mainFieldData : ""
        }
      }

      let add : Relation = {
        mainTable : sourceNode.getOptions().name || "",
        targetTable : targetNode.getOptions().name || "",
        relationType : "1:N",
        mainField,
        targetField
      }
      rs.push(add)
    });
    return rs
  }

  
  createPorts(node : SchemaNodeModel,fields : Field[]){
    fields.forEach(field => {
      node.addField({fieldName : field.fieldName , fieldType : field.fieldType })
    });
  }

  allTableWithFkData(){
    let rs : any = []
    let tables = this.allTable()
    tables.forEach(tb=>{
      let tbData : any = tb
      let tbid = tb.id
      if(tbid === undefined) tbid = ""
      let node = this.findNodeById(tbid)
      for (let i = 0; i < tb.fields.length; i++) {
        let field = tb.fields[i]
        let fkData = this.getFkDataFromField(node,field)
        console.log(fkData)
        let fieldData : any= {...field , ...fkData}
        tbData.fields[i] = fieldData
      }
 
      rs.push(tbData)
    })
    return rs
  }

  findNodeById(id:string) : SchemaNodeModel {
    return this.getEngine().getModel().getNode(id) as SchemaNodeModel
  }

  getFkDataFromField(node : SchemaNodeModel ,field : Field){
    console.count("check fk field")
    let rs : any = {
      fieldName : "",
      tableName : ""
    }
    let fk = field.fieldOption?.fk
    if(fk === undefined || !fk) return rs
    let inPort = node.getPortFromID(field.inId) as SchemaPortModel
    let outPort = node.mirrorPort(inPort) as SchemaPortModel

    let linksIn =  this.findSourcesLinkInPort(inPort)

    let targetPortFromLinkIn = this.getTargetInPortFromLink(linksIn)

    if(targetPortFromLinkIn !== undefined){
      let targetNode = targetPortFromLinkIn.getNode() as SchemaNodeModel
      rs.fieldName = targetPortFromLinkIn.getOptions().label
      rs.tableName = targetNode.getOptions().name
      return rs
    }

    let linksOut = this.findSourcesLinkInPort(outPort)

    let targetPortFromLinkout = this.getTargetInPortFromLink(linksOut)

    if(targetPortFromLinkout !== undefined ) {
      let targetNode = targetPortFromLinkout.getNode() as SchemaNodeModel
      rs.fieldName = targetPortFromLinkout.getOptions().label
      rs.tableName = targetNode.getOptions().name
      return rs
    }

  }

  getTargetInPortFromLink(links : LinkModel[]){
    if(links.length > 0){
      let targetPort = links[0].getTargetPort() as SchemaPortModel
      if(targetPort.getOptions().in === false){ // if out port convert to in port
        let targetNode = targetPort.getNode() as SchemaNodeModel
        let InTargetPort = targetNode.mirrorPort(targetPort) 
        return InTargetPort
      }else{
        return targetPort
      }
    }
    return undefined
  }

  allTable(){
    let rs: TableData[] = []
    let alltb = this.getEngine().getModel().getNodes() as SchemaNodeModel[]
    alltb.forEach(tb => {
      let add = this.nodeToTable(tb)
      rs.push(add)
    });
    return rs
  }

  currentTable(){
    let rs: TableData = {
      id: "",
      tablename: '',
      fields: []
    }
    const node = this.currentNode()
    if(node === undefined) return rs 
    if (node instanceof SchemaNodeModel) rs = this.nodeToTable(node as SchemaNodeModel)
    
    return rs
  }

  nodeToTable(node : SchemaNodeModel) : TableData{
    let name = node.getOptions().name
    if (name == undefined) name = ""
    return {
      id : node.getID(),
      tablename : name,
      fields : node.getAllField()
    }
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

  undo = () => {
    alert("this feature dont work yet coming soon")
    //this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyZ' });
  }

  redo = () => {
    alert("this feature dont work yet coming soon")
    //this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyZ' });
  }
    

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