import { useState, Fragment, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Axios from 'axios'

import {useGlobalContext} from './Context'
import ReCAPTCHA from 'react-google-recaptcha'

function Signup() {
    const navigate = useNavigate()/*   */
    const reRef = useRef()
    const [opensnack, setOpensnack] = useState(false);
    const [snackmsg, setSnackmsg] = useState('')
    const [openlnrprogbar, setOpenlnrprogbar] = useState(false)
    const handleSnackopen = (v) => {
        setSnackmsg(v)
        setOpensnack(true)
    };
    const handleSnackclose = () => {
        setOpensnack(false)
    };
    const snackaction = (
        <Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackclose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
    );

    const {resetToken, resetUserName, resetEmail, token, resetUserId} = useGlobalContext()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //console.log('Signup rendered',token)

    //Axios.defaults.withCredentials = true

    const handlesubmit = async (e) => {
        e.preventDefault()
        //console.log("e")
        setOpenlnrprogbar(true)

        const ctoken = await reRef.current.executeAsync()
        reRef.current.reset()

        Axios.post("http://localhost:8089/register", {
            username: username,
            email: email,
            pass: password,
            ctoken:ctoken
        }).then((res) => {
            //console.log(res,"THEn")
            setOpenlnrprogbar(false)
            if(res.data === "User Already Exist. Please Login"){
                alert("Email Already Exists")
            } else {
                localStorage.setItem("token", res.data.token)
                resetToken(res.data.token)
                resetUserName(res.data.username)
                resetUserId(res.data.insertId)
                resetEmail(res.data.email)
                navigate("/")
            }
        }).catch((err) => {
            setOpenlnrprogbar(false)
            console.log(err)
            handleSnackopen(err.response.data)
            localStorage.setItem("token", null)
            //alert("Unknown Error Occured")
        })
    }

    return (
        <>
            <ReCAPTCHA 
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                size="invisible"
                ref={reRef}
            />
            {
                openlnrprogbar?(
                    <Box sx={{ position:'relative', width: '100%', top:'100%' }}>
                        <LinearProgress />
                    </Box>
                ):(
                    <></>
                )
            }
            <Snackbar
                open={opensnack}
                autoHideDuration={6000}
                onClose={handleSnackclose}
                message={snackmsg}
                action={snackaction}
            />
            <div className="lspagelogin">
                <div className="lspagelocreate">
                    <h2>Signup</h2>
                    <form onSubmit={handlesubmit}>
                        <label>username:</label>
                        <input 
                            type="text" 
                            required 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>email:</label>
                        <input 
                            type="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>password:</label>
                        <input
                            type="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <button style={{margin:"0px"}}>Submit</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
        
    );
}
 
export default Signup;