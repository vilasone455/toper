import React, { FunctionComponent } from 'react'
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import TableMat from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import classes from '*.module.css';
import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export interface TableEditorProp{
    isOpen : boolean,
    onclose : () => void
}




  export const LEFT = styled.div<{}>`
width : 30%;
height: 100vh;
color : white;
font-size : 20px;
background-color: #005AA0;
`;

export const MenuList = styled.div<{}>`

color : white;

padding : 15px;
margin-bottom : 10px;
`;

export const Menu = styled.div<{}>`

color : white;
font-size : 15px;
margin : 8px;

`;
  

export const Right = styled.div<{}>`
width : 70%;
background-color: "white";
margin : 15px;
font-size : 20px;

`;


interface ExportFunctions {
  isOpen : boolean,
  onclose : () => void,
  exportPng : () => void,
  exportPdf : () => void
}


export class ExportEditor extends React.Component<ExportFunctions> {

    

    render() {
        const r = `Create Table Product (
                id int;
                ProdutName varchar;
                ProductPrice int;
                Category int;
                Primary key id
            )
            
            //////////////////////////

            Create Table ProductImage (
                id int;
                ProductId int
                ImageUrl varchar
                Primary key id
            )
        `
        return (
            <Drawer anchor={"right"} open={this.props.isOpen} style={{width : 400}} onClose={this.props.onclose}>
               <div
      style={{width : 500 , display : "flex"}}
      role="presentation"
        className=""
    >
   
      <LEFT>
          <IconButton color="inherit" size="medium"><HighlightOffIcon></HighlightOffIcon></IconButton>
        <MenuList>
            <Menu>Sql</Menu>
            <Menu onClick={this.props.exportPng}>Image</Menu>
            <Menu onClick={this.props.exportPdf}>Pdf</Menu>

            <Divider style={{marginTop:10,color : "white"}} light={true}></Divider>

            <Menu>Laravel</Menu>
            <Menu>Golang Gin</Menu>

        </MenuList>
      </LEFT>
      <Right>
        <div>Export sql</div>
        <TextField label="Filled" variant="filled" multiline
          rowsMax={20} style={{marginTop:20,width:"100%",height:400}} value={r}></TextField>

          <Button variant="outlined" color="primary" style={{marginRight:10}}>Copy</Button>
          <Button variant="contained" color="primary" >Download</Button>
      </Right>

    </div>
            </Drawer>
        )
    }
}