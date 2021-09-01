import { Dialog } from "@material-ui/core"
import { FunctionComponent } from "react"

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DialogContent, ModalProp , DialogActions} from './modalprop'
import Button from '@material-ui/core/Button';

const shortcutlist : any[] = [
    {
        code : "CTRL+N",
        text : "New Table"
    },
    {
        code : "CTRL+S",
        text : "Save Project"
    },
    {
        code : "CTRL+C",
        text : "Copy Table"
    },
    {
        code : "CTRL+V",
        text : "Cut Table"
    },
    {
        code : "CTRL+D",
        text : "Duplicate Table"
    },
    {
        code : "CTRL+Z",
        text : "Redo Action"
    },
    {
        code : "CTRL+X",
        text : "Undo Action"
    },

]

export const ShortCutMenu: FunctionComponent<ModalProp> = ({isOpen , onClose}) => {
    return (
        <Dialog open={isOpen} aria-labelledby="simple-dialog-title" >
             <DialogTitle id="simple-dialog-title">Shortcut</DialogTitle>
             <DialogContent dividers>

             <List>
        {shortcutlist.map((s) => (
          <ListItem button >
        
            <ListItemText primary={s.code} style={{marginRight:50}} /> 

            
            <ListItemText primary={s.text} />
          </ListItem>
        ))}
        </List>

             </DialogContent>

             <DialogActions>
                 <Button color="primary" onClick={onClose}>Close</Button>
             </DialogActions>
             

        </Dialog>
    )
}