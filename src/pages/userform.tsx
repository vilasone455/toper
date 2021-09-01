import { Button, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultUser, jsonToUser, User } from "../interface/user";
import { RootState } from "../store";
import axios from 'axios'
import { SetUser } from "../reducer/auth/action";

export const UserFrom : FunctionComponent = () => {

    const user = useSelector((state: RootState) => state.AuthReducer.user);

    const [userName, setuserName] = useState("")

    const [userLastname, setuserLastname] = useState("")

    const [userEmail, setuserEmail] = useState("")

    const [userPassword, setuserPassword] = useState("")

    const dispatch = useDispatch()  

    useEffect(() => {
        alert("init user form")
        setuserEmail(user.userEmail)
        setuserName(user.userName)
        setuserPassword(user.userPassword)
    }, [])

    const onSave = () => {

        let updateUser : User = {
            ...user,
            userEmail,
            userName,
            userLastname,
            userPassword
        }

        updateUser.userLastname = "testt"

        alert(JSON.stringify(updateUser))
    
        let url = "https://toperbackend.herokuapp.com/user/" + user._id
        
        axios.put(url , updateUser).then(rs=>{
            console.log(rs)
            if(rs.status === 200){
                  let userrs = jsonToUser(rs.data)
                  console.log(userrs)
                  dispatch(SetUser(updateUser))
            }
        })
        
        

    }

    return (
        <Box flexGrow={1}>

            <TextField label="User Email" value={userEmail} 
             onChange={(e) => setuserEmail(e.target.value)}  fullWidth style={{ margin: 8 }} />

            <TextField label="User Name" value={userName} 
                onChange={(e) => setuserName(e.target.value)} fullWidth style={{ margin: 8 }} />
            
            <TextField label="User Password" value={userPassword} 
                onChange={(e) => setuserPassword(e.target.value)}  fullWidth style={{ margin: 8 }} />

            <Button onClick={onSave}>Save</Button>

        </Box>
    )
}