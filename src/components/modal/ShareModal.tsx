import { FunctionComponent, useRef } from "react";

import {DialogContent , DialogActions, ModalProp } from './modalprop'
import { Avatar, Box, Dialog, DialogTitle, Typography , TextField , IconButton, makeStyles, Theme, createStyles } from "@material-ui/core"
import Button from '@material-ui/core/Button';

import AssignmentIcon from '@material-ui/icons/Assignment';
import InputAdornment from '@material-ui/core/InputAdornment';
import { toast } from "react-toastify";

interface ShareModalProp extends ModalProp {
    linkUrl : string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    modalPaper: {
        minWidth: '75vh',
        maxWidth: '75vh',
    },

 
  }),
);

export const ShareModal: FunctionComponent<ShareModalProp> = ({linkUrl, isOpen  , onClose}) => {

    const classes = useStyles();
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(linkUrl);
            toast.success("Copy Link Success")
          } catch (err) {
            toast.error("Copy Link Fail")
          }
    }

    return (
        <Dialog open={isOpen} aria-labelledby="share-dialog" classes={{ paper: classes.modalPaper }} >
        <DialogTitle id="share-dialog">Share you Diagram</DialogTitle>
        <DialogContent>

          <TextField

            margin="dense"
            id="linkurl"
            label="Link Url"
            fullWidth
            value={linkUrl}
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end" >
                    <IconButton onClick={onCopy}  >
                        <AssignmentIcon/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
   
        </DialogActions>
      </Dialog>
    )
}