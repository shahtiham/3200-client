import { useEffect, useState, Fragment, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Axios from 'axios'
import {useGlobalContext} from './Context'
import ReCAPTCHA from 'react-google-recaptcha'

const theme = createTheme();
const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid rgba(25, 118, 210, 0.5)',
    borderRadius:'4px',
    boxShadow: 24,
    p: 4,
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.state?location.state.pathname:null
    
    const {token} = useGlobalContext()
    const {resetToken, resetUserName, resetEmail, resetUserId, ckifloggedin} = useGlobalContext()

    const reRef = useRef()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //console.log('login rendered', token, navigate)

    const [openmodal, setOpenmodal] = useState(false);
    const handleOpenmodal = () => setOpenmodal(true);
    const handleClosemodal = () => {setOpenmodal(false);setModalemailvis('hidden')}
    const [valuefromcodefield, setValuefromcodefield] = useState(null);
    const [valuefromemailfield, setValuefromemailfield] = useState(null);
    const [modalemailvis, setModalemailvis] = useState('hidden')

    const handleChangecodefield = (value) => {
        setValuefromcodefield(value);
    }
    const handleChangeemailfield = (value) => {
        setValuefromemailfield(value);
    }

    const [openpassmodal, setOpenpassmodal] = useState(false);
    const handleOpenpassmodal = () => setOpenpassmodal(true);
    const handleClosepassmodal = () => setOpenpassmodal(false);
    const [valuefromcodepassfield, setValuefromcodepassfield] = useState(null);
    const [valuefromemailpassfield, setValuefromemailpassfield] = useState(null);
    const [valuefrompassfieldpassmodal, setValuefrompassfieldpassmodal] = useState(null);

    const handleChangecodepassfield = (value) => {
        setValuefromcodepassfield(value);
    }
    const handleChangeemailpassfield = (value) => {
        setValuefromemailpassfield(value);
    }
    const handleChangepassfieldpassmodal = (value) => {
        setValuefrompassfieldpassmodal(value)
    }

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

    function mkReq(){
        return new Promise((resolve, reject) => {
            /* https://tiham.herokuapp.com/ */
            Axios.get("http://localhost:8089/isloggedin", {headers:{"authorization": `${token}`}})
            .then((res) => {
                //console.log(res)
                if(res.data.isloggedin === 'loggedin'){
                    reject()
                } else {
                    resolve()
                }
            })
            .catch((err) => {
                //console.log(err)
                localStorage.setItem("token", null)
                localStorage.setItem("email", null)
                resetToken(null)
                resetUserName(null)
                resetUserId(null)
                resetEmail(null)
                resolve()
            })
        })
    }
    
    const ckL = async (a) => {
        try{
            const ck = await mkReq()
        } catch {
            navigate("/questions")
        }
    }

    useEffect(() => {
        console.log('yee')
        if(token !== null || token !== undefined) ckL('a')
    },[])

    const handlesubmit = async (e) => {
        e.preventDefault()
        setOpenlnrprogbar(true)
        //console.log("le")

        const ctoken = await reRef.current.executeAsync()
        reRef.current.reset()

        // check if already logged in...
        try{
            const ckres = await mkReq()
            
            // this section is exec. when user is NOT logged in...
            // LOG USER IN...
            Axios.post("http://localhost:8089/login", {
                email: email,
                pass: password,
                ctoken:ctoken
            }).then((res) => {
                setOpenlnrprogbar(false)
                console.log(res,"THEn", location?.pathname)
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("email", res.data.email)
                resetToken(res.data.token)
                resetUserName(res.data.username)
                resetUserId(res.data.id)
                resetEmail(res.data.email)
                //console.log(navigate(-1))
                path === null || path === '' ? location?.pathname === "/" ? navigate("/questions") : navigate(-1)
                : path === '/login' || path === '/signup' ? navigate('/questions') : navigate(-1) ;
            }).catch((err) => {
                //console.log(err)
                setOpenlnrprogbar(false)
                handleSnackopen(err.response.data)
                if(err.response.data === 'please verify email'){
                    handleOpenmodal() // opens modal
                }
                //alert("Invalid Credentials")
                localStorage.setItem("token", null)
                localStorage.setItem("email", null)
            })

        } catch (Error) {
            // this section is exec. when user is logged in...
            //console.log("ALREADY LOGGED IN...")
            //alert("Already Logged In")
            handleSnackopen(Error.message)
        }
        
    }

    const handleverification = (e) => {
        e.preventDefault()
        if(valuefromcodefield === null || valuefromcodefield === undefined || valuefromcodefield === ""){
            handleSnackopen("Verification code needed")
            return
        }
        setOpenlnrprogbar(true) // opens progressbar
        Axios.post("http://localhost:8089/verifyuser", {
            code: valuefromcodefield,
            email:valuefromemailfield
        }).then((res) => {
            console.log(res)
            setOpenlnrprogbar(false) // closes progressbar
            if(res.data === 'Verified'){
                handleSnackopen(res.data)
                setValuefromcodefield(null)
                setValuefromemailfield(null)
                handleClosemodal() // closes modal
            }
        }).catch((err) => {
            console.log(err)
            setOpenlnrprogbar(false)
            handleSnackopen(err.response.data)
        })
    }

    const handleresendcode = (e) => {
        e.preventDefault()
        console.log(valuefromemailfield)
        if(valuefromemailfield === null || valuefromemailfield === undefined || valuefromemailfield === ""){
            handleSnackopen("Email address is needed")
            return
        }
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/resendverify", {
            email: valuefromemailfield
        }).then((res) => {
            setOpenlnrprogbar(false)
            console.log(res)
            if(res.data === 'Verification code resent successfully'){
                handleSnackopen(res.data)
                //setValuefromcodefield(null)
                //setValuefromemailfield(null)
                //handleClosemodal() // closes modal
            }
        }).catch((err) => {
            //console.log(err)
            setOpenlnrprogbar(false)
            handleSnackopen(err.response.data)
        })
    }

    const handlepasscodesend = (e) => {
        e.preventDefault()
        if(valuefromemailpassfield === null || valuefromemailpassfield === undefined || valuefromemailpassfield === ""){
            handleSnackopen("Email address is needed")
            return
        }
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/sendpassresetcode", {
            email:valuefromemailpassfield
        }).then((res) => {
            console.log(res)
            setOpenlnrprogbar(false)
            handleSnackopen(res.data)
        }).catch((err) => {
            console.log(err)
            setOpenlnrprogbar(false)
            handleSnackopen(err.response.data)
        })
    }
    
    const handlepassreset = (e) => {
        e.preventDefault()
        if(valuefromcodepassfield === null || valuefromcodepassfield === undefined || valuefromcodepassfield === "" 
        || valuefrompassfieldpassmodal === null || valuefrompassfieldpassmodal === undefined || valuefrompassfieldpassmodal === ""){
            handleSnackopen("Both Code and New Password are required")
            return
        }
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/resetpass", {
            pass:valuefrompassfieldpassmodal,
            code:valuefromcodepassfield,
            email:valuefromemailpassfield
        }).then((res) => {
            setOpenlnrprogbar(false)
            console.log(res)
            if(res.data === 'Password has been reset successfully'){
                handleSnackopen(res.data)
                setValuefromcodepassfield(null)
                setValuefrompassfieldpassmodal(null)
                setValuefromemailpassfield(null)
                handleClosepassmodal() // closes modal
            }
        }).catch((err) => {
            console.log(err)
            setOpenlnrprogbar(false)
            handleSnackopen(err.response.data)
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
            {/* email verificaiton modal */}
            <Modal
                open={openmodal}
                onClose={handleClosemodal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{display:'flex', top:'10px'}}>
                        <TextField
                            style={{width:'300px'}}
                            id="outlined-multiline-flexible"
                            label="Verification Code"
                            multiline
                            maxRows={4}
                            value={valuefromcodefield}
                            onChange={(e)=>handleChangecodefield(e.target.value)}
                        />
                        
                        <Button style={{right:'10px',position:'absolute', top:'20%'}} variant="outlined" onClick={handleverification}>
                            verify
                        </Button>
                    </Box>
                    <Box style={{display:'flex'}}>
                        <TextField
                            style={{width:'300px', top:'15px'}}
                            id="outlined-multiline-flexible"
                            label="Email"
                            multiline
                            maxRows={4}
                            value={valuefromemailfield}
                            onChange={(e)=>handleChangeemailfield(e.target.value)}
                        />

                        {/* <Button style={{right:'10px',position:'absolute', top:'70%', visibility:`${modalemailvis}`}} variant="outlined" onClick={handleresendcode}>
                            Resend
                        </Button> */}
                    </Box>
                    <Button style={{top:'20px'}} size='small' onClick={(e) => {handleresendcode(e)}}>Resend verification code</Button>
                    
                </Box>
            </Modal>

            {/* password reset modal */}
            <Modal
                open={openpassmodal}
                onClose={handleClosepassmodal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{display:'flex'}}>
                        <TextField
                            style={{width:'300px'}}
                            id="outlined-multiline-flexible"
                            label="Password Reset Code"
                            multiline
                            maxRows={4}
                            value={valuefromcodepassfield}
                            onChange={(e)=>handleChangecodepassfield(e.target.value)}
                        />
                        
                        <Button style={{right:'10px',position:'absolute', top:'30%'}} variant="outlined" onClick={handlepassreset}>
                            Reset
                        </Button>
                    </Box>
                    <TextField
                        style={{width:'300px',top:'10px'}}
                        id="outlined-multiline-flexible"
                        label="New Password"
                        multiline
                        maxRows={4}
                        value={valuefrompassfieldpassmodal}
                        onChange={(e)=>handleChangepassfieldpassmodal(e.target.value)}
                    />
                    
                    <Box style={{display:'flex'}}>
                        <TextField
                            style={{width:'300px', top:'25px'}}
                            id="outlined-multiline-flexible"
                            label="Email"
                            multiline
                            maxRows={4}
                            value={valuefromemailpassfield}
                            onChange={(e)=>handleChangeemailpassfield(e.target.value)}
                        />

                        <Button style={{right:'10px',position:'absolute', top:'79%'}} variant="outlined" onClick={handlepasscodesend}>
                            Send Code
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={opensnack}
                autoHideDuration={6000}
                onClose={handleSnackclose}
                message={snackmsg}
                action={snackaction}
            />
            <div className="lspagelogin">
                <div className="lspagelocreate">
                    <h2>Login</h2>
                    <form onSubmit={handlesubmit}>
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
                        
                        <div >
                            <Grid container>
                                <Grid item xs>
                                    <Link className="onhovercurpoint" variant="body2" onClick={(e) => {handleOpenpassmodal()}}>
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <button>Submit</button>
                                <Grid style={{textColor:'blue'}} item>
                                    <Link className="onhovercurpoint" variant="body2" onClick={(e) => {handleOpenmodal()}}>
                                        verify email
                                    </Link>
                                </Grid>
                            </Grid>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    );
}
 
export default Login;