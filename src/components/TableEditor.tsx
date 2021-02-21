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


import TextField from '@material-ui/core/TextField';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DiagramEngine, NodeModel } from '@projectstorm/react-diagrams';
import { SchemaNodeModel, Field } from '../schemanode/node/SchemaNodeModel';
import { DiagramController } from '../DiagramController/DiagramCtr';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

export interface TableProps {
  isOpen: boolean,
  diagramctr: DiagramController,
  forceUpdate: boolean,
  onclose: () => void
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
      padding: 10
    }

  }),
);


export const TableEditor: FunctionComponent<TableProps> = ({ isOpen, diagramctr, onclose, forceUpdate }) => {


  const classes = useStyles();

  const [currentTable, setTable] = useState(getNodeData(diagramctr))

  const [otherTable, setotherTable] = useState(getOtherTable())

  const [textInput, settextInput] = useState("")


  const [isEdit, setisEdit] = useState(false)

  const [currentSelectTableId, setcurrentSelectTableId] = useState("")

  const [currentFieldId, setcurrentFieldId] = useState("")

  const currentField = useMemo(() => loadTableFieldSelect(), [currentSelectTableId]);

  const [toggleUpdate, settoggleUpdate] = useState(false)

  const [currentEdit, setcurrentEdit] = useState("")

  const [typeSelect, settypeSelect] = useState("")

  useEffect(() => {
    setTable(getNodeData(diagramctr))
    console.log('update tb')
  }, [isOpen, toggleUpdate, forceUpdate])

  function getOtherTable(): TableData[] {


    let rs: TableData[] = []
    let alltb = diagramctr.getEngine().getModel().getNodes() as SchemaNodeModel[]
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


  function getNodeData(diagramctr: DiagramController): TableData {
    let rs: TableData = {
      id: "",
      tablename: '',
      fields: []
    }
    let node = diagramctr.currentNode()

    if (node == undefined) return rs

    if (node instanceof SchemaNodeModel) {
      console.log("Start getNodeData function")
      let nodedata = node as SchemaNodeModel
      let tbname = nodedata.getOptions().name
      if (tbname === undefined) tbname = ""
      rs.tablename = tbname
      rs.id = nodedata.getID()
      rs.fields = getFieldsData(nodedata)
    }

    return rs
  }

  function getFieldsData(node: SchemaNodeModel): Field[] {
    let fieldlist = node.getAllField()
    console.log("get all fields")
    console.log(fieldlist)
    return fieldlist
  }

  function setEditField(id: string, fieldName: string) {
    setisEdit(true)
    settextInput(fieldName)
    setcurrentEdit(id)
  }

  function closeEdit() {
    setisEdit(true)
    updateNode()
    setcurrentEdit("")
  }

  function updateNode() {
    let newtb = currentTable

    let indexof = newtb.fields.findIndex(f => f.fieldName == currentEdit)

    if (indexof == -1) return

    newtb.fields[indexof].fieldName = textInput

    if (typeSelect != "") newtb.fields[indexof].fieldType = typeSelect
    setTable(newtb)

    diagramctr.updateNode(newtb)
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

  function onChangeFieldSelect(e: any) {
    let targetPortOutId = e.target.value
    let sourceField = currentTable.fields.find(f => f.fieldName == currentEdit)

    setcurrentFieldId(targetPortOutId)

    let currentTableId = (currentTable.id == undefined) ? "" : currentTable.id == undefined
    if (currentTableId == currentSelectTableId || sourceField == undefined) return // if link self table and selt field
    alert('on link')

    let sourceFieldId = (sourceField.inId == undefined) ? "" : sourceField.inId
    diagramctr.linkModel(currentSelectTableId, targetPortOutId, sourceFieldId)

  }

  function onSelectForeignKey() {
    let node = diagramctr.currentNode() as SchemaNodeModel
    if (node == undefined) return
    let field = currentTable.fields.find(f => f.fieldName == currentEdit)

    if (field == undefined) return

    let portid = field.inId
    if (portid == undefined) portid = ""

    let option = {
      portId: portid,
      fkTb: currentSelectTableId,
      fkField: currentFieldId
    }
    //node.addOrUpdateFieldOption(option)
    diagramctr.getEngine().repaintCanvas()
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
      console.log('field option undifine')
      return false
    }
    if (optionName == "pk") return fieldOption.pk
    if (optionName == "fk") return fieldOption.fk

  }

  function setFieldOption(e: any, idField: string | undefined, optionName: string) {

    if (idField == undefined) return

    console.log(optionName)

    let fieldIndexof = currentTable.fields.findIndex(f => f.inId == idField)
    let tb = currentTable
    let newfieldOption = tb.fields[fieldIndexof].fieldOption
    if (newfieldOption == undefined) return

    if (optionName == "pk") {
      newfieldOption.pk = !newfieldOption.pk
    }
    if (optionName == "fk") {
      newfieldOption.fk = !newfieldOption.fk
    }

    tb.fields[fieldIndexof].fieldOption = newfieldOption
    setTable(tb)

    console.log(newfieldOption)
    diagramctr.updateFieldOption(tb.fields[fieldIndexof])
    settoggleUpdate(!toggleUpdate)
  }

  return <Drawer anchor={"right"} open={isOpen} style={{ width: 600 }} onClose={onclose}>
    <div>
      <Appbar onDelete={onDelete} title={currentTable.tablename} onEndEdit={onNameChange}></Appbar>
      <TableContainer>
        <TableMat aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Field Name</TableCell>
              <TableCell className={classes.cell}>Type Name</TableCell>
              <TableCell className={classes.cell}>PK</TableCell>
              <TableCell className={classes.cell}>FK</TableCell>
              <TableCell className={classes.cell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTable.fields.map((row: Field, index: number) => (
              <TableRow key={row.fieldName} className={classes.cell}>
                {(isEdit && currentEdit == row.fieldName) ?
                  <>
                    <TableCell component="th" scope="row" className={classes.cell}>
                      <input onBlur={() => closeEdit()}
                        onChange={handleChange} value={textInput} />
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes.cell}>
                      <select onChange={handleTypeChange} value={typeSelect} >
                        <option value="int">Interger</option>
                        <option value="varchar">Varchar</option>
                        <option value="float">Float</option>
                        <option value="bool">Boolean</option>
                      </select>
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes.cell}>

                      <select placeholder="Select Table" value={currentSelectTableId} onChange={onSelectTableChange}>
                        {otherTable.map(o => <option key={o.id} value={o.id}>{o.tablename}</option>)}
                      </select>

                      <select placeholder="Select Field" value={currentFieldId} onChange={onChangeFieldSelect}>
                        {currentField.map(f => <option key={f.fieldName} value={f.outId}>{f.fieldName}</option>)}
                      </select>
                    </TableCell>
                  </>
                  :
                  <>
                    <TableCell className={classes.cell} component="th" scope="row" onClick={() => setEditField(row.fieldName, row.fieldName)}>
                      {row.fieldName}
                    </TableCell>

                    <TableCell className={classes.cell} component="th" scope="row" onClick={() => setEditField(row.fieldName, row.fieldName)}>
                      {row.fieldType}
                    </TableCell>
                  </>
                }

                <TableCell className={classes.cell}>
                  <input type="checkbox" checked={(getFieldOption(row, "pk"))}
                    onChange={(e) => setFieldOption(e, row.inId, "pk")} key={`pk${row.inId}`} />
                </TableCell>
                <TableCell>
                  <input type="checkbox" checked={(getFieldOption(row, "fk"))}
                    onChange={(e) => setFieldOption(e, row.inId, "fk")} />
                </TableCell>
                <TableCell className={classes.cell} >
                  <IconButton onClick={() => removeField(row.inId)} size="small">
                    <DeleteOutlineIcon></DeleteOutlineIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
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