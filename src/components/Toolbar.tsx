import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import DeleteIcon from '@material-ui/icons/Delete';
import TableChartIcon from '@material-ui/icons/TableChart';

import Box from '@material-ui/core/Box';

import { MenuSelect } from './MenuSelect'
import CropOutlinedIcon from '@material-ui/icons/CropOutlined';
import CutIcon from '../components/Icons/Cut'
import CopyIcon from "../components/Icons/Copy"
import DuplicateIcon from '../components/Icons/Duplicate.jsx'
import { AppBar, IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import Cherons from '../components/Icons/Chevrons'
import MatToolbar from '@material-ui/core/Toolbar';
import ControlPointDuplicateIcon from '@material-ui/icons/ControlPointDuplicate';
import FilterNoneOutlinedIcon from '@material-ui/icons/FilterNoneOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    showBtn: {
      position: "absolute",

      transform: "rotate(180deg)",
      backgroundColor: "#FFFF",
      border: `1px solid ${theme.palette.divider}`,
      justifyContent: "flex-end",
      right: 5
    },

    hideBtn: {
      transform: "rotate(360deg)"
    },

    root: {
      border: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
      '& svg': {
        margin: theme.spacing(0.75),
      },
      '& hr': {
        margin: theme.spacing(0, 0.5),
      },

    },
  }),
);

interface ToolbarFunction {
  isDark : boolean,
  isRender: boolean,
  isNodeSelect: boolean,
  onRedo : () => void,
  onUndo : () => void,
  onZoomSelectChange : (name:string) => void,
  onZoomIn: () => void,
  onZoomOut: () => void,
  onZoomFit: () => void,

  onCopy: () => void,
  onCut: () => void,
  onDup: () => void,
  onDel: () => void,
  newTable: () => void
}

const zoomLevel: any = [{
  id: "100%zoom",
  text: "100%",
  selectOption: true
},
{
  id: "75%zoom",
  text: "75%",
  selectOption: true
},
{
  id: "50%zoom",
  text: "50%",
  selectOption: true
},
{
  id: "resetview",
  text: "Reset View",
  selectOption: false
}]

export const Toolbar: FunctionComponent<ToolbarFunction> = ({onZoomSelectChange,onUndo , onRedo , isDark, isNodeSelect, isRender,
  onZoomIn, onZoomOut, onZoomFit, newTable, onCopy, onCut, onDup, onDel }) => {

  const [isExpand, setisExpand] = useState(true)

  const classes = useStyles();

  const getBgColor = () => {
    return (isDark) ? "#333333" : "#FFFF"
  }

  function handleZoomChange(id:string , text:string){
    if(id === undefined) {
      console.log("undefine")
      return
    }
    console.log(id)
    onZoomSelectChange(text)
  }

  return (

    <div style={{ position: "absolute", width: "100%", zIndex: 50 }}>
      {isExpand ? (
         <Grid container className={classes.root} style={{backgroundColor:getBgColor()}}>
            
            <IconButton size="small" onClick={newTable} >
              <TableChartIcon></TableChartIcon>
            </IconButton>


            <Divider orientation="vertical" flexItem />
            <IconButton size="small" color="inherit" onClick={onRedo}>
              <Redo />
            </IconButton>

            <IconButton size="small" onClick={onUndo} >
              <Undo />
            </IconButton>

            <Divider orientation="vertical" flexItem  />
            <MenuSelect items={zoomLevel} defaultMenuText="100%" menuName="zoomSelect" onSelectChange={handleZoomChange} />

            <IconButton size="small" onClick={onZoomIn} >
              <ZoomInIcon />
            </IconButton>

            <IconButton size="small" onClick={onZoomOut} >
              <ZoomOutIcon />
            </IconButton>

            <IconButton size="small" onClick={onZoomFit}  >
              <AspectRatioIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem />

            <IconButton size="small" onClick={onCopy} disabled={!isNodeSelect} >
              <FilterNoneOutlinedIcon style={{fontSize:20}} />
            </IconButton>
            <IconButton size="small" onClick={onCut} disabled={!isNodeSelect} >
              <CropOutlinedIcon style={{fontSize:20}}  />
            </IconButton>

            <IconButton size="small" onClick={onDup} disabled={!isNodeSelect} >
              <ControlPointDuplicateIcon style={{fontSize:20}}  />
            </IconButton>

            <IconButton size="small" onClick={onDel} disabled={!isNodeSelect} >
              <DeleteIcon style={{fontSize:20}} />
            </IconButton>

            <span style={{ display: "flex", flexGrow: 1 }} />

            <IconButton size="small" onClick={() => setisExpand(false)} className={classes.hideBtn} >
              <Cherons size={20}></Cherons>
            </IconButton>

            </Grid>
 
       
  

      ) : (<IconButton size="small" onClick={() => setisExpand(true)} className={classes.showBtn}>
        <Cherons size={25}></Cherons>
      </IconButton>)
      }






    </div>


  );
}