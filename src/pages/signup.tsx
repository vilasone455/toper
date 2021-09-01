import React ,  { FunctionComponent, useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinkMat from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { LoginPayload } from "../interface/loginpayload";
import { initApp } from "../reducer/loadapp";
import { register } from "../reducer/auth/thunkaction"
import { Link, useHistory } from "react-router-dom";
import { User } from "../interface/user";
import { ToggleLoading } from "../reducer/share/action";
import { NoficationIfError } from "../api/nofication";
import { RootState } from "../store";

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <LinkMat color="inherit" href="https://material-ui.com/">
          Your Website
        </LinkMat>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  

export const SignUp: FunctionComponent = () => {
    const classes = useStyles();

    const dispatch = useDispatch()

    const [userName, setuserName] = useState("")

    const [userLastname, setuserLastname] = useState("")

    const [userEmail, setuserEmail] = useState("")

    const [userPassword, setuserPassword] = useState("")

    const errorMsg = useSelector((state : RootState) => state.alertReducer.error)

    const history = useHistory()

    const onLogin = async () => {
        let user: any = {
            userName,
            userLastname,
            userPassword,
            userEmail
        }
        dispatch(ToggleLoading(true))
        await dispatch(register(user))
        dispatch(ToggleLoading(false))
        NoficationIfError( (err:string) => {
          console.log(err)
          if(err === ""){
            history.push("/")
          }
          return
        })
        
        //
      
        
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} noValidate >
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User name"


              onChange={(e) => setuserName(e.target.value)} value={userName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="User Lastname"
              name="lastname"
              onChange={(e) => setuserLastname(e.target.value)} value={userLastname}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"

              onChange={(e) => setuserEmail(e.target.value)} value={userEmail}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setuserPassword(e.target.value)} value={userPassword}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onLogin}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <LinkMat href="#" variant="body2">
                  Forgot password?
                </LinkMat>
              </Grid>
              <Grid item>
                <Link to="/signup">
                <LinkMat href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </LinkMat>
                </Link>
                
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
}