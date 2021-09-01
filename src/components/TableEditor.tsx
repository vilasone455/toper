import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Appbar } from './Appbar'
import TableMat from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import IconButton from '@material-ui/core/IconButton';

import { BaseModel } from '@projectstorm/react-canvas-core'
import CreateIcon from '@material-ui/icons/Create';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import TextField from '@material-ui/core/TextField';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DefaultPortModel, DiagramEngine, NodeModel, PathFindingLinkFactory } from '@projectstorm/react-diagrams';
import { SchemaNodeModel, Field, fieldOptionSchema, OptionList, OptionEnum } from '../schemanode/node/SchemaNodeModel';
import { DiagramController } from '../DiagramController/DiagramCtr';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { Box, Collapse, MenuItem, Select, Typography , FormControl, withStyles } from '@material-ui/core';
import { SchemaPortModel } from '../schemanode/port/SchemaPortModel';
import { FakerList } from '../data/faker';
import { SeedGeneratorModal } from './modal/SeedGeneratorModal';


export interface TableProps {
  isOpen: boolean,
  diagramctr: DiagramController,
  forceUpdate: boolean,
  onclose: () => void,
}

export interface TableData {
  id?: string,
  tablename: string,
  fields: Field[]
}





const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styledTable: {
      "borderCollapse": "collapse",
      "margin": "25px 0", "fontSize": "0.9em", "fontFamily": "sans-serif",
      "minWidth": "400px", "boxShadow": "0 0 20px rgba(0, 0, 0, 0.15)"
    },

    cell: {
      border : "1px solid grey",
      padding: 8,
      
    },
    selectOption : {
      height: 28,
      marginTop:10
    },
    smallbtn : {
      width:20,
      height:20
    },
    smallInput : {
      height: 12
    }

  }),
);

const Row = withStyles(theme => ({
  root: {

  }
}))(TableRow);

const Cell = withStyles(theme => ({
  root: {
    
    padding:7
  }
}))(TableCell);

enum testEnum  {
  pk = "pk",
  un = "un",
  fk = "fk",
  ai = "ai",
  defaultVal = "defaultVar"
}


export const TableEditor: FunctionComponent<TableProps> = ({ isOpen, diagramctr, onclose, forceUpdate }) => {

  const classes = useStyles();

  const [isOptionEdit, setisOptionEdit] = useState("")

  const [currentTable, setTable] = useState(getNodeData(diagramctr))

  const [relationName, setrelationName] = useState("")

  const [otherTable, setotherTable] = useState(getOtherTable())

  const [textInput, settextInput] = useState("")


  const [isEdit, setisEdit] = useState(false)

  const [currentSelectTableId, setcurrentSelectTableId] = useState("")

  const [currentFieldId, setcurrentFieldId] = useState("")

  const currentField = useMemo(() => loadTableFieldSelect(), [currentSelectTableId]);

  const [toggleUpdate, settoggleUpdate] = useState(false)

  const [currentEdit, setcurrentEdit] = useState("")

  const [typeSelect, settypeSelect] = useState("")

  const [seedModal, setseedModal] = useState(false)

  useEffect(() => {
		window.addEventListener('keydown', shortcutHandler);
  }, [])

  useEffect(() => {

    console.log('re render')
    setTable(getNodeData(diagramctr))
    setotherTable(getOtherTable())
    
		window.addEventListener('keydown', shortcutHandler);
  }, [isOpen, toggleUpdate, forceUpdate])

  const shortcutHandler = (event:any) => {
		const { ctrlKey, shiftKey, code } = event;
		if (code === 'Enter') {
		  event.preventDefault();
		  //alert('enter key')

      closeEdit()
      
		}
	}

  function onBeforeClose(){
    setcurrentSelectTableId("")
    setcurrentFieldId("")
    setcurrentEdit("")
    setisEdit(false)
    onclose()
    
  }

  function getOtherTable(): TableData[] { return diagramctr.allTable() }

  function getNodeData(diagramctr: DiagramController) { return diagramctr.currentTable() }

  function setEditField(id: string | undefined, fieldName: string) {
    if (id === undefined) id = ""
    setisEdit(true)
    settextInput(fieldName)
    setcurrentEdit(id)
    let node = diagramctr.currentNode()
    if(node === undefined) return

    let inId = id
    let outId = node.getOutIdFromInId(inId)

    let portSelectIn = node.getPortFromID(inId) as SchemaPortModel
    let portSelectOut = node.getPortFromID(outId) as SchemaPortModel

    let linkIn = diagramctr.findSourcesLinkInPort(portSelectIn)

    let linkOut = diagramctr.findSourcesLinkInPort(portSelectOut)

    if(linkIn.length > 0 ){
      const targetPort = linkIn[0].getTargetPort() as SchemaPortModel
      setcurrentSelectTableId(targetPort.getNode().getID())
      let targetNode = targetPort.getNode() as SchemaNodeModel
      setcurrentFieldId(targetNode.getInIdFromOutId(targetPort.getID()))
      return
    }

    if(linkOut.length > 0){ 
      const targetPort = linkOut[0].getTargetPort() as SchemaPortModel
      setcurrentSelectTableId(targetPort.getNode().getID())
      setcurrentFieldId(targetPort.getID())
      return
    }


  }

  function closeEdit() {
    setisEdit(true)
    updateNode()
    setcurrentEdit("")
  }

  function updateNode() {
    let newtb = currentTable

    //let indexof = newtb.fields.findIndex(f => f.fieldName == currentEdit)

    let indexof = newtb.fields.findIndex(f => f.inId == currentEdit)

    if (indexof == -1) return

    newtb.fields[indexof].fieldName = textInput

    
    let tbname = isVaildAutoLinkRule(textInput)
    if(tbname !== undefined){
      for (let i = 0; i < otherTable.length; i++) {
        const tb = otherTable[i];
 
        if(tb.tablename === tbname){
          let connectb = otherTable.find(t=>t.tablename === tbname)
          if(connectb === undefined) continue
          let targetPortId = connectb.fields[0].inId 
          alert(connectb.fields[0].fieldName)
          if(targetPortId === undefined) targetPortId = ""
          let connectid = connectb.id
          if(connectid === undefined) connectid = ""
          let targetPortParamter : any = {
            target : {value : targetPortId , targetNodeId : connectid}
          }
          let connectNodeId = connectb.id
          if(connectNodeId !== undefined){
            onChangeFieldSelect(targetPortParamter , connectNodeId)
            targetPortParamter.value = ""
            let fieldOption = newtb.fields[indexof].fieldOption
            if(fieldOption !== undefined){
              fieldOption.fk = true
            }
          }
          
 
          break
        }
      }
      
    }
    

    if (typeSelect != "") newtb.fields[indexof].fieldType = typeSelect
    setTable(newtb)

    diagramctr.updateNode(newtb)
  }

  function isVaildAutoLinkRule(text:string){
    const regex = /(\S+)_id/g;
    let m = regex.exec(text)
    while (m !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }

    let tb_name = m[1]
    return tb_name

    }
    return undefined
  }

  function handleChange(e: any) {
    settextInput(e.target.value)
  }

  function handleTypeChange(e: any) {
    settypeSelect(e.target.value)
  }

  function onDelete() {
    let node = diagramctr.currentNode()
    if (node == undefined) return
    diagramctr.deleteSelected()
    onclose()
  }



  function newField() {
    let node = diagramctr.currentNode()
    if (node == undefined) return
    node.AddNewField()

    let newtb = currentTable
    newtb.fields.push({
      fieldName: "test",
      fieldType: "int"
    })
    setTable(newtb)

    settoggleUpdate(!toggleUpdate)

    diagramctr.getEngine().repaintCanvas()
  }

  function removeField(id: string | undefined) {
    if (id == undefined) return
    let node = diagramctr.currentNode()
    if (node == undefined) return
    node.removeFieldbyId(id)
    settoggleUpdate(!toggleUpdate)
    diagramctr.getEngine().repaintCanvas()
  }

  function onSelectTableChange(e: any) {
    setcurrentSelectTableId(e.target.value)
  }

  function loadTableFieldSelect(): Field[] {
    if (currentSelectTableId == "") return []
    let tb = otherTable.find(t => t.id === currentSelectTableId)
    if (tb == undefined) return []
    return tb.fields
  }

  function onChangeFieldSelect(e: any , currentTargetNode? : string) {
    if (e.target.value === "") {
      return
    }

    let targetPortId = e.target.value
    let sourceField = currentTable.fields.find(f => f.inId === currentEdit)

    setcurrentFieldId(targetPortId)

    const currentNode = diagramctr.currentNode()

    if(currentNode === undefined) return

    if (sourceField == undefined) return  // if link self table and selt field

    alert(currentSelectTableId)


    let targetNode = (currentTargetNode === undefined) ? diagramctr.getNodeById(currentSelectTableId) : diagramctr.getNodeById(currentTargetNode)

    const dir = diagramctr.direactionNode(currentNode , targetNode)

    const sourcePort = (dir === "front") ? currentNode.portInIdtoPortOut(currentEdit) : currentNode.getPortFromID(currentEdit) as SchemaPortModel

    const targetPort = (dir === "front") ? targetNode.getPortFromID(targetPortId) as SchemaPortModel : targetNode.portInIdtoPortOut(targetPortId)
    //before link must remove link from source port :: INCOMPLETE TODO
    diagramctr.linkModel(sourcePort, targetPort)

  }


  function onNameChange(e: string) {
    let newtb = currentTable
    newtb.tablename = e
    setTable(newtb)

    diagramctr.updateNodeName(e)

    settoggleUpdate(!toggleUpdate)

  }

  function getFieldOption(f: Field, optionName: string): any {
    let fieldOption = f.fieldOption
    if (fieldOption == undefined) {
      return false
    }
    if (optionName == "pk") return fieldOption.pk
    if (optionName == "fk") return fieldOption.fk
    if (optionName == "ai") return fieldOption.ai

  }

  function getOption(f: Field, opt : OptionEnum) : any{
    let fieldOption = f.fieldOption
    if (fieldOption == undefined) {
      return false
    }

    return fieldOption[opt]
  }

  function setField(e: {target: fieldOptionSchema} , idField: string | undefined){
    if (idField == undefined) return
    let newtb = {...currentTable}
    let fieldIndexof = newtb.fields.findIndex(f => f.inId == idField)
    let fieldopt = newtb.fields[fieldIndexof].fieldOption
    if(fieldopt === undefined) return
    let type = e.target.type
    console.log(type)
    if(type === "checkbox"){
      let val = !fieldopt[e.target.name] as any
      fieldopt[e.target.name]  = val
    }else if(type === "text"){
      fieldopt[e.target.name] = e.target.value
    }

    setTable(newtb)

  }

  function getFieldOptionById(idField : string){
    //let fieldIndexof = newtb.fields.findIndex(f => f.inId == idField)
    //let fieldOpt = newtb.fields[fieldIndexof].fieldOption
    //if(fieldOpt === undefined) return
  }

  function onFakerValueChange(e : any , idField: string | undefined){
    if (idField == undefined) return
    let newtb = {...currentTable}
    let fieldIndexof = newtb.fields.findIndex(f => f.inId == idField)
    let fieldOpt = newtb.fields[fieldIndexof].fieldOption
    if(fieldOpt === undefined) return
    console.log(e.target.value)
    fieldOpt.faker = e.target.value
    setTable(newtb)
  }

  function setFieldOption(e : any, idField: string | undefined, optionName: string) {

    const val = e.target.value

    if (idField == undefined) return

    let fieldIndexof = currentTable.fields.findIndex(f => f.inId == idField)

    let tb = currentTable
    let newfieldOption = tb.fields[fieldIndexof].fieldOption

    if (fieldIndexof === -1 || newfieldOption === undefined) return

    if (optionName === "pk") {
      newfieldOption.pk = !newfieldOption.pk
    }
    if(optionName === "ai"){
      newfieldOption.ai = !newfieldOption.ai
    }
    if (optionName === "fk") {
      newfieldOption.fk = !newfieldOption.fk
      if (newfieldOption.fk === false) {
        const node = diagramctr.currentNode()
        if (node === undefined) return
        diagramctr.removeLinkbyPort(node.getPortInByIndex(fieldIndexof), node.getPortOutByIndex(fieldIndexof))
      }

    }

    tb.fields[fieldIndexof].fieldOption = newfieldOption
    setTable(tb)

    console.log(newfieldOption)
    diagramctr.updateFieldOption(tb.fields[fieldIndexof])
    settoggleUpdate(!toggleUpdate)
  }

  function onSelectRelation(portid: string | undefined, portOutId: string | undefined, event: React.ChangeEvent<{ value: unknown }>) {
    if (portid === undefined || portOutId === undefined) return
    const node = diagramctr.currentNode()
    if (node === undefined) return
    const portIn = node.getPortFromID(portid) as SchemaPortModel
    const portOut = node.getPortFromID(portOutId) as SchemaPortModel
    if (portIn === null || portOut === null) return
    setrelationName(event.target.value as string)
    diagramctr.connectRealation(portIn, portOut, event.target.value as string)

  }

  function quickSwitch(id:string){
    let currentnode = diagramctr.currentNode()
    if(currentnode !== undefined) currentnode.setSelected(false)
    let selectnode = diagramctr.findNodeById(id)
    selectnode.setSelected(true)
    console.log(selectnode.getOptions().name)
    diagramctr.getEngine().repaintCanvas()
    settoggleUpdate(!toggleUpdate)
  }

  function tableSelect(){
    let rs = otherTable.map(t=>{
      let add : any = {
        id : t.id,
        text : t.tablename
      }
      return add
    })
    return rs 
  }

  return <Drawer anchor={"right"} open={isOpen} style={{ width: 600 }} onClose={onBeforeClose}>
    <div>
      
      <Appbar onDelete={onDelete} title={currentTable.tablename} 
      onEndEdit={onNameChange} onSelectTable={quickSwitch} tables={tableSelect()} />
      
      <TableContainer>
      
        <TableMat aria-label="simple table" >
          <TableHead>
            <TableRow>
           
              <Cell ></Cell>
              <Cell >Field Name</Cell>
              <Cell >Type Name</Cell>
              <Cell >PK</Cell>
              <Cell >AI</Cell>
              <Cell >NN</Cell>
              <Cell >Action</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTable.fields.map((row: Field) => (
              <React.Fragment key={row.inId}>

                <Row>
                  <Cell >
                    <IconButton aria-label="expand row" size="small" >
                      {(isEdit && currentEdit === row.inId) ? <SaveAltIcon className={classes.smallbtn} onClick={() => closeEdit()} /> : <CreateIcon className={classes.smallbtn} onClick={() => setEditField(row.inId, row.fieldName)} />}
                    </IconButton>
                  </Cell>
                  {(isEdit && currentEdit == row.inId) ?
                    <>

                      <Cell component="th" scope="row" >
                        <input onBlur={() => closeEdit()}
                          onChange={handleChange} value={textInput} />
                      </Cell>
                      <Cell component="th" scope="row" >
                        <select onChange={handleTypeChange} value={typeSelect} >
                          <option value="int">Interger</option>
                          <option value="varchar">Varchar</option>
                          <option value="float">Float</option>
                          <option value="date">Date</option>
                          <option value="bool">Boolean</option>
                        </select>
                      </Cell>

                    </>
                    :
                    <>
                      <Cell  component="th" scope="row" onClick={() => setEditField(row.inId, row.fieldName)}>
                        {row.fieldName}
                      </Cell>

                      <Cell component="th" scope="row" onClick={() => setEditField(row.inId, row.fieldName)}>
                        {row.fieldType}
                      </Cell>
                    </>
                  }

                  <Cell >
                    <input type="checkbox" checked={(getOption(row, OptionEnum.pk))}
                      onChange={(e) => setFieldOption(e, row.inId, "pk")} key={`pk${row.inId}`} />
                  </Cell>
                  <Cell >
                    <input type="checkbox" checked={(getOption(row, OptionEnum.ai))} onChange={(e) => setFieldOption(e, row.inId, "ai")} key={`ai${row.inId}`} />
                  </Cell>
                  <Cell >
                    <input type="checkbox" name={OptionEnum.notnull} checked={(getOption(row, OptionEnum.notnull))} 
                    onChange={(e:any) => setField(e,row.inId) } key={`nn${row.inId}`}   />
                  </Cell>
                  <Cell  >
                    <IconButton onClick={() => removeField(row.inId)} size="small">
                      <DeleteOutlineIcon className={classes.smallbtn}></DeleteOutlineIcon>
                    </IconButton>
                  </Cell>
                </Row>
                <TableRow>
                  <Cell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={(isEdit && currentEdit === row.inId)} timeout="auto" unmountOnExit>
                      <Box margin={1} display="flex" flexDirection="column"> 

                      <Select displayEmpty  name="faker" onChange={(e:any) => onFakerValueChange(e ,row.inId)}
                        value={(getOption(row , OptionEnum.faker))} 
                        className={classes.selectOption} variant="outlined">
                          {FakerList.map((f:any) =>{
                            return (<option key={`faker${f.text}`} value={f.value}>{f.text}</option>)
                          })}
                      </Select>


                        <TextField key={`defaultinput${row.inId}`} label="Default Value" name="defaultVal" onChange={(e) => setField(e as any,row.inId)}
                        value={(getOption(row , OptionEnum.defaultVal))} InputProps={{ classes: { input: classes.smallInput } }} variant="outlined" size="small"/>

                        <Cell>
                          <input type="checkbox" checked={(getFieldOption(row, "fk"))}
                            onChange={(e) => setFieldOption(e, row.inId, "fk")} />
                        </Cell>
                        {(getFieldOption(row, "fk")) ? <React.Fragment >

                        <FormControl variant="outlined" size="small"  >

                        <Select className={classes.selectOption} displayEmpty variant="outlined"  value={currentSelectTableId} onChange={onSelectTableChange}>
                            <MenuItem value="" > -- Select Ref Table -- </MenuItem>
                            {otherTable.map(tb => {
                              const ele = currentTable.id !== tb.id ?
                                <MenuItem key={"option-" + tb.id} value={tb.id}>{tb.tablename}</MenuItem> : ""
                              return ele
                            })}
                          </Select>

                          <Select className={classes.selectOption} displayEmpty style={{ minWidth: 100 }} 
                          value={currentFieldId} onChange={e => onChangeFieldSelect(e)}>

                            <MenuItem style={{ display: "none" }} value=""></MenuItem>
                            {currentField.map(f => <option key={f.fieldName} value={f.inId}>{f.fieldName}</option>)}
                          </Select>

                          <Select className={classes.selectOption} displayEmpty value={relationName} onChange={(e) => onSelectRelation(row.inId, row.outId, e)}>
                            <MenuItem value="1:1">One to One</MenuItem>
                            <MenuItem value="1:N">One to Many</MenuItem>
                          </Select>

                        </FormControl>

                          

                        </React.Fragment>
                          : ""}


                      </Box>
                    </Collapse>
                  </Cell>
                </TableRow>

              </React.Fragment>

            ))}
          </TableBody>
        </TableMat>
      </TableContainer>
      <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => newField()}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  </Drawer>
}