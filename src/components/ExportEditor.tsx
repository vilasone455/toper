import React, { FunctionComponent, useEffect, useState } from 'react'
import Drawer from '@material-ui/core/Drawer';

import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//mongodb+srv://topster:<password>@cluster0.hbfnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//aaebaYCK6opQGeRA

export interface TableEditorProp {
  isOpen: boolean,
  onclose: () => void
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




export const SqlExport: FunctionComponent<ExportSqlProp> = ({ code, fileName, isRender, onDownloadClick , onInputChange }) => {
  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>Export sql</div>
        <TextField label="file name" variant="filled" value={fileName} onChange={onInputChange} />
        <TextField label="Filled" variant="filled" multiline
          rowsMax={20} style={{ marginTop: 20, width: "100%", height: 400 }} value={code}  />
        <Button variant="outlined" color="primary" style={{ marginRight: 10 }}>Copy</Button>
        <Button variant="contained" color="primary" onClick={onDownloadClick} >Download</Button>
      </div>
    )
  }
}

export const ImageExport: FunctionComponent<ExportImageProp> = ({ fileName, isRender, imageType, onDownloadClick , onInputChange }) => {
  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>Export Image</div>
        <TextField label="file name" variant="filled" value={fileName} onChange={onInputChange} />

        <Button variant="contained" color="primary" onClick={onDownloadClick}  >Download</Button>
      </div>
    )
  }
}

enum MenuEnum {
  Image,
  MySql,
  SqlServer,
  Postresql,
  Laravel
}


interface ExportProp {
  isOpen: boolean,
  fileName : string,
  onclose: () => void,
  exportPng: (filename : string) => void,
  exportPdf: (filename : string) => void,
  exportSql: (filename : string) => void,
  exportTest : (a : string) => void
}

interface ExportEvent {
  onclose: () => void,
  exportPng: () => void,
  exportPdf: (filename : string) => void,
  exportSql: (filename : string) => void
}

interface MenuExport {
  isRender: boolean,
  fileName: string,
  onInputChange : (e : any) => void,
  onDownloadClick: () => void
}

interface ExportImageProp extends MenuExport {
  imageType: string
}

interface ExportSqlProp extends MenuExport {
  code: string,
}

export const ExportEditor: FunctionComponent<ExportProp> = ({ isOpen, onclose, exportPng,  exportSql , exportTest , fileName}) => {

  const [currentMenu, setcurrentMenu] = useState(MenuEnum.Image)

  const [currentFileName, setcurrentFileName] = useState("")

  useEffect(() => {
    if(isOpen === false){
      setcurrentFileName(fileName)
    }
    
  }, [fileName])

  const handleFileNameInput = (e : any) => setcurrentFileName(e.target.value)

  const onExportSql = () => {
    exportSql(currentFileName + ".sql")
  }

  const onExportPng = () => {
    exportPng(currentFileName + ".png")
  }

  return (

    <Drawer anchor={"right"} open={isOpen} style={{ width: 400 }} onClose={onclose}>
      <div
        style={{ width: 500, display: "flex" }}
        role="presentation"
        className=""
      >

        <LEFT>
          <IconButton color="inherit" size="medium"><HighlightOffIcon></HighlightOffIcon></IconButton>
          <MenuList>
            <Menu onClick={() => setcurrentMenu(MenuEnum.MySql)}>Sql</Menu>
            <Menu onClick={() => setcurrentMenu(MenuEnum.Image)}>Image</Menu>
            <Menu onClick={() => exportTest('filename test')}>Pdf</Menu>

            <Divider style={{ marginTop: 10, color: "white" }} light={true}></Divider>

            <Menu>Laravel</Menu>
            <Menu>Golang Gin</Menu>

          </MenuList>
        </LEFT>
        <Right>
          <SqlExport isRender={currentMenu == MenuEnum.MySql}
          onInputChange={handleFileNameInput} code={""} fileName={currentFileName} onDownloadClick={onExportSql} />
          <ImageExport isRender={currentMenu == MenuEnum.Image} 
          onInputChange={handleFileNameInput} imageType="png" fileName={currentFileName} onDownloadClick={onExportPng} />
        </Right>

      </div>
    </Drawer>
  )
}
