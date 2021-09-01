import React, { FunctionComponent, useState } from "react";
import { ModalProp } from "./modalprop";

import {DialogContent , DialogActions} from './modalprop'
import { Box, Dialog, DialogTitle, TextField, Typography } from "@material-ui/core"
import Button from '@material-ui/core/Button';
import axios from "axios";
import { ToggleLoading } from "../../reducer/share/action";
import { useDispatch } from "react-redux";

export const ContactModal: FunctionComponent<ModalProp> = ({isOpen , onClose}) => {

    const dispatch = useDispatch()
    const [sendName, setsendName] = useState("")
    const [sendEmail, setsendEmail] = useState("")
    const [message, setmessage] = useState("")

    const onSend = () => {
        let url = "https://toperbackend.herokuapp.com/contact"
        let msg : any = {
            userName : sendName,
            userEmail : sendEmail,
            message : message
        }

        dispatch(ToggleLoading(true))
        
        axios.post(url , msg).then(rs=>{
            dispatch(ToggleLoading(false))
            onClose()
        })
    }

    return (
        <Dialog open={isOpen} aria-labelledby="simple-dialog-title" maxWidth={"lg"} >
        <DialogTitle>Contact us</DialogTitle>
        <DialogContent dividers >
            <Box display="flex" justifyContent="center" alignItems="center"  flexDirection="column">

                <TextField label="Name" style={{marginTop:16}} variant="outlined" value={sendName} onChange={(e)=>setsendName(e.target.value)} />
                <TextField label="Email" style={{marginTop:16}} variant="outlined" value={sendEmail} onChange={(e)=>setsendEmail(e.target.value)} />
                <TextField label="Message" style={{marginTop:16,width:"100%"}} variant="outlined" value={message}  multiline
          rows={4} onChange={(e)=>setmessage(e.target.value)} />

            </Box>
            
        </DialogContent>
        <DialogActions>
        <Button autoFocus onClick={onSend} color="primary">
            Send
          </Button>
        <Button autoFocus onClick={onClose} color="primary">
            Close
          </Button>
 
        </DialogActions>
   </Dialog>
    )
}