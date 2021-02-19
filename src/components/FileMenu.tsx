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
    isOpen : boolean
}




  export const LEFT = styled.div<{}>`
width : 25%;
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
font-size : 20px;
margin : 8px;

`;
  

export const Right = styled.div<{}>`
width : 75%;
background-color: "white";
margin : 15px;
font-size : 20px;

`;




export class FileMenu extends React.Component<TableEditorProp> {

    

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
            <Drawer anchor={"right"} open={false} style={{width : 400}}>
               <div
      style={{width : 500 , display : "flex"}}
      role="presentation"
        className=""
    >
   
      <LEFT>
          <IconButton color="inherit" size="medium"><HighlightOffIcon></HighlightOffIcon></IconButton>
        <MenuList>
            <Menu>File</Menu>
            <Menu>Export</Menu>
            <Menu>Setting</Menu>

            <Divider style={{marginTop:10,color : "white"}} light={true}></Divider>
        </MenuList>
      </LEFT>
      <Right>
        <div>Propertie</div>
        <TextField label="Title" variant="filled" multiline style={{marginTop:20,width:"100%"}}
         value={"E-commerce"}></TextField>

            <div style={{marginTop:15}}>Status Share</div>


          <div style={{marginTop:15}}>
          <Button variant="outlined"  style={{marginRight:10 }}>Public</Button>
          <Button variant="outlined"  style={{marginRight:10 }}>Protected</Button>
          <Button variant="outlined" color="primary" style={{marginRight:10 }}>Private</Button>
          </div>
          
      </Right>

    </div>
            </Drawer>
        )
    }
}