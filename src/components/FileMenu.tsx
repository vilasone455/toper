import React, { FunctionComponent , useState} from 'react'
import Drawer from '@material-ui/core/Drawer';

import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie'

export interface TableEditorProp {
  isOpen: boolean,
  onclose : () => void,
  onLogin : (userName : string , userPassword : string) => void
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

interface MenuProp {
  isRender : boolean,

}

interface LoginProp extends MenuProp{
  userName : string,
  userPassword : string,
  onUserName : (e : any) => void,
  onUserPassword : (e : any) => void,
  onLogin : (userName : string , userPassword : string) => void
}

export const LoginForm: FunctionComponent<LoginProp> = ({ isRender , userName , userPassword , onLogin , onUserName , onUserPassword }) => {
  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>Login</div>
        
            <TextField label="User Name" variant="filled"  style={{ marginTop: 20, width: "100%" }}
              value={userName} onChange={onUserName}></TextField>

            <TextField label="User Password" variant="filled"  style={{ marginTop: 20, width: "100%" }}
              value={userPassword} onChange={onUserPassword}></TextField>

            <div style={{ marginTop: 15 }}>
         
              <Button variant="outlined" color="primary" style={{ marginRight: 10 }} 
              onClick={() => onLogin(userName , userPassword)}>Login</Button>
            </div>
       
      </div>
    )
  }
}

export const AccoutDetail: FunctionComponent<MenuProp> = ({ isRender  }) => {
  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>Accout</div>
            <TextField label="Title" variant="filled" multiline style={{ marginTop: 20, width: "100%" }}
              value={"E-commerce"}></TextField>

            <div style={{ marginTop: 15 }}>Status Share</div>


            <div style={{ marginTop: 15 }}>
              <Button variant="outlined" style={{ marginRight: 10 }}>Public</Button>
              <Button variant="outlined" style={{ marginRight: 10 }}>Protected</Button>
              <Button variant="outlined" color="primary" style={{ marginRight: 10 }}>Private</Button>
            </div>
       
      </div>
    )
  }
}

export const FileDetail: FunctionComponent<MenuProp> = ({ isRender  }) => {



  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>Propertie</div>
            <TextField label="Title" variant="filled" multiline style={{ marginTop: 20, width: "100%" }}
              value={"E-commerce"}></TextField>

            <div style={{ marginTop: 15 }}>Status Share</div>


            <div style={{ marginTop: 15 }}>
              <Button variant="outlined" style={{ marginRight: 10 }}>Public</Button>
              <Button variant="outlined" style={{ marginRight: 10 }}>Protected</Button>
              <Button variant="outlined" color="primary" style={{ marginRight: 10 }}>Private</Button>
            </div>
       
      </div>
    )
  }
}

export const ListProject: FunctionComponent<MenuProp> = ({ isRender  }) => {
  if (!isRender) {
    return (<div></div>)
  } else {
    return (
      <div>
        <div>List</div>
            <TextField label="Title" variant="filled" multiline style={{ marginTop: 20, width: "100%" }}
              value={"E-commerce"}></TextField>

            <div style={{ marginTop: 15 }}>Status Share</div>


            <div style={{ marginTop: 15 }}>
              <Button variant="outlined" style={{ marginRight: 10 }}>Public</Button>
              <Button variant="outlined" style={{ marginRight: 10 }}>Protected</Button>
              <Button variant="outlined" color="primary" style={{ marginRight: 10 }}>Private</Button>
            </div>
       
      </div>
    )
  }
}

enum MenuEnum {
  Account,
  FileSelect,
  ProjectList
  
}

export const FileMenu: FunctionComponent<TableEditorProp> = ({ isOpen , onLogin , onclose  }) => {

  const [currentMenu, setcurrentMenu] = useState(MenuEnum.Account)

  const [userName, setuserName] = useState("")

  const [userPassword, setuserPassword] = useState("")

  const onUserNameFunc = (e : any) => {setuserName(e.target.value)}

  const onUserPasswordFunc = (e : any) => {setuserPassword(e.target.value)}



  function isLogin(){
		let token = Cookies.get("ertoken")
		if(token === undefined || token === "") {
			//show login
		}else{
			
		}
	}



  return (
    <Drawer anchor={"left"} open={isOpen} style={{ width: 400 }} onClose={onclose}>
      <div
        style={{ width: 500, display: "flex" }}
        role="presentation"
        className="">

        <LEFT>
          <IconButton color="inherit" size="medium"><HighlightOffIcon></HighlightOffIcon></IconButton>
          <MenuList>
            <Menu onClick={() => setcurrentMenu(MenuEnum.Account)}>Accout</Menu>
            <Menu onClick={() => setcurrentMenu(MenuEnum.FileSelect)}>File</Menu>
            <Menu onClick={() => setcurrentMenu(MenuEnum.ProjectList)}>Project</Menu>
            <Menu>Setting</Menu>

            <Divider style={{ marginTop: 10, color: "white" }} light={true}></Divider>
          </MenuList>
        </LEFT>
        <Right>

          <LoginForm isRender={true} userName={userName} userPassword={userPassword} 
          onUserName={onUserNameFunc} onUserPassword={onUserPasswordFunc} onLogin={onLogin} />

          <AccoutDetail isRender={currentMenu === MenuEnum.Account} />

          <FileDetail isRender={currentMenu === MenuEnum.FileSelect} /> 
          
          <ListProject isRender={currentMenu === MenuEnum.ProjectList} />

        </Right>

      </div>
    </Drawer>
  )
}


