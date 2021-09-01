import React, { FunctionComponent, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';

import { blue } from '@material-ui/core/colors';
import { Box, Grid } from "@material-ui/core";
import styled from '@emotion/styled';
import {DialogContent , DialogActions} from "./modal/modalprop"

export const Card = styled.div<{selected: boolean }>`
    display : flex;
    flex-direction : column;
    justify-content: center;
		border: solid 1px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'grey')};
		color: white;
    border-radius: 5px;
`;

export const CardTitle = styled.div<{  selected: boolean }>`
		background-color: ${(p) => (p.selected ? 'blue' : '#EDF2F7') } ;
    color : ${(p) => (p.selected ? 'white' : 'black') };
    padding : 10px;
    text-align : center;
    font-size: 16px;
`;

export const CardContent = styled.div<{ }>`
    margin-top : 10px;
    display : flex;
    flex-direction : column;
    align-items: center;
		color: white;
    height:100px;
    font-size: 13px;
`;


export interface ItemSelectStruct{
    name : string,
    icon : string,
}

export interface ItemSelectProps{
    modalName : string
    items : ItemSelectStruct[],
    isOpen : boolean,
    onClose : (id:string) => void
}

export const ItemSelect: FunctionComponent<ItemSelectProps> = ({modalName, isOpen , items , onClose}) => {


    const [currentSelect, setcurrentSelect] = useState("")


  const handleClose = () => {
    onClose(currentSelect);
  };

  const selectItemClick = (value: string) => {
    setcurrentSelect(value)
  };


    return (<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
        <DialogTitle id="simple-dialog-title">Select Export Database</DialogTitle>
        <DialogContent dividers>

        <Grid container spacing={3} justify="center" style={{padding:20}}>
        
        {items.map((item) => (
          <Grid item xs={4}  key={modalName+item.name}>
          <Card onClick={() => selectItemClick(item.name)} selected={currentSelect === item.name}>
            <CardTitle selected={currentSelect === item.name}>{item.name}</CardTitle>
            <CardContent>
            <Avatar variant="rounded" src="/img/mysql.png" style={{backgroundColor:"grey" }} />
      
              <div style={{marginTop:10}}>Export Schema of diagram to MySql DDL File</div>
            </CardContent>
          </Card>
        </Grid>

          ))}
        </Grid>

        </DialogContent>
        

        <DialogActions>
          <Button onClick={handleClose}>
          Download
          </Button>
        </DialogActions>

      </Dialog>)
    
}