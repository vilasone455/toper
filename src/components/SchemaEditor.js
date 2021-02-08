import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';

import TableMat from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';

import TableChartIcon from '@material-ui/icons/TableChart';
import SaveIcon from '@material-ui/icons/Save';
import ShareIcon from '@material-ui/icons/Share';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


import { useDispatch , useSelector } from "react-redux"
import Tabmat from './TabMat'
import Appbar from './Appbar'
import {initEngine , newNode} from '../libs/schemeReduce'
import {OpenEditor , Table , NewNode} from '../libs/tablereducer'


const useStyles = makeStyles({
  list: {
    width: 500,
  },
  fullList: {
    width: 'auto',
  },
});

function createData(Name, TypeName, PK, FK) {
  return { Name, TypeName, PK, FK };
}

const rows = [
  createData('Product Id', "varchar", false, false),
  createData('Product Name', "varchar", false , false),
  createData('Product Price', "int", false , false),

];

//const engine = useSelector(
  //  (state: RootState) => state.schemeReducer.engine
  //);


function getCurrentNode(){

}


export default function TemporaryDrawer() {
  const dispatch = useDispatch()
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const tableform = {
    table_name : "",
    node_id : "",
    fields : []
  }


  //const [state, setstate] = useState()

  //const currentSelect = useSelector(state => state.schemaEditor.isOpen)
const currentSelect = false

  const toggleDrawer = (anchor, open) => (event) => {
    console.log("toggle")
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Appbar></Appbar>
       <TableContainer>
      <TableMat aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field Name</TableCell>
            <TableCell>Type Name</TableCell>
            <TableCell>PK</TableCell>
            <TableCell>FK</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              {(row) ? <TableCell component="th" scope="row"> {row.Name}
              </TableCell> : <div>Edit</div>} 
               
              
              <TableCell >{row.TypeName}</TableCell>
              <TableCell >{row.PK}</TableCell>
              <TableCell >{row.FK}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMat>
    </TableContainer>
    <IconButton color="primary" aria-label="upload picture" component="span">
          <AddCircleOutlineIcon />
        </IconButton>
    </div>
  );

  return (
    <div>
      <Tabmat></Tabmat>
      <Button onClick={toggleDrawer("right", true)}  startIcon={<TableChartIcon />} onClick={() => dispatch(NewNode(tableform))}>New Table</Button>
      <Button startIcon={<SaveIcon />}>Save File</Button>
      <Button startIcon={<ArrowDownwardIcon />} onClick={() => dispatch(OpenEditor(true))}>Export {currentSelect}</Button>
      <Button startIcon={<ShareIcon />} >Share File</Button>
          <Drawer anchor={"right"} open={false} onClose={()=> dispatch(OpenEditor(true))}>
            {list("right")}
          </Drawer>

    </div>
 
  );
}