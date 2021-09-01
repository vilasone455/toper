import { Box } from "@material-ui/core";
import { FunctionComponent, useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';


interface ImageExportProp{
    fileName:string,
    onClose : (filename : string) => void,
    isOpen : boolean
}

export const ImageExport: FunctionComponent<ImageExportProp> = ({fileName,onClose , isOpen}) => {

    const handleSave = () => {
      onClose(curFileName)
    };
  
    const handleClose = () => {
      onClose("")
    };

    const [curFileName, setcurFileName] = useState("")

    useEffect(() => {
        setcurFileName(fileName)
    }, [fileName])

    return (
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog">
        <DialogTitle id="image-dialog">Download Image File</DialogTitle>
        <DialogContent>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="File name"
            fullWidth
            value={curFileName}
            onChange={(e) => setcurFileName(e.target.value)}
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    .png
                  </InputAdornment>
                ),
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>
           )
}