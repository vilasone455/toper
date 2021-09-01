import React, { FunctionComponent } from "react";
import { ModalProp } from "./modalprop";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {DialogContent , DialogActions} from './modalprop'
import { Avatar, Box, Dialog, DialogTitle, Typography } from "@material-ui/core"
import Button from '@material-ui/core/Button';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import { connect, useSelector } from "react-redux";
import { NodeTheme } from "../../reducer/theme/theme";
import { RootState } from "../../store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    large: {
      width: theme.spacing(17),
      height: theme.spacing(17),
    },
  }),
);

interface GetStateProp{
	nodetheme ?: NodeTheme;
}


type Props = ModalProp & GetStateProp

const mapStateToProps = (state: RootState) => ({
	nodetheme: state.themeReducer.nodeTheme
  })

export const AboutModal: FunctionComponent<Props> = ({isOpen , onClose , nodetheme}) => {


    const classes = useStyles();
    return (
        <Dialog open={isOpen} aria-labelledby="simple-dialog-title" maxWidth={"lg"}>
        <DialogTitle>About me {nodetheme?.bgcolor}</DialogTitle>
        <DialogContent dividers>
            <Box display="flex" justifyContent="center" alignItems="center"  flexDirection="column">

            <Avatar alt="Remy Sharp" className={classes.large} src="https://scontent.fvte5-1.fna.fbcdn.net/v/t1.0-9/133066269_1544165279306893_2889225793573942981_o.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_eui2=AeH0crNZwTsftFvkTEpdZTIk0we91EcMnDjTB73URwycOGl3RPFP4FiRsHjMTo0bdbrfDGEpZ0IdsT25j89xHugP&_nc_ohc=zBDZH1kO9ekAX9Eml5z&_nc_ht=scontent.fvte5-1.fna&oh=1e3ab0d9e343800bf8269466a0c5e9f4&oe=60700D3A" sizes="lg" />

            <Typography variant="h5" style={{marginTop:5}}>Mr.Top Phougmixay</Typography>
            <Typography variant="h6" style={{marginTop:5}}>I am Indie Developer</Typography>

            <Box display="flex" style={{marginTop:5}}>
              <a href="https://topsters45@gmail.com" target="_blank">
                <EmailIcon fontSize="large" color="primary" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100011403073446" target="_blank">
                <FacebookIcon fontSize="large" color="primary" />
              </a>
              <a href="https://github.com/vilasone455" target="_blank">
                <GitHubIcon fontSize="large" color="primary"/>
              </a>
                
          
            </Box>
            </Box>
            
        </DialogContent>
        <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
            Close
          </Button>
 
        </DialogActions>
   </Dialog>
    )
}

export default connect(mapStateToProps)(AboutModal)
