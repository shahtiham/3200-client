import './bodySection.css';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


import questions from './qdata';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import React, { Fragment, useEffect, useState, useRef, useContext } from 'react';
import Axios from 'axios'
import {useGlobalContext} from './Context'
import { useQpgContext } from './Singleqs';

import MarkDown from './MarkDown';

function  Editor(){
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
    //Axios.defaults.withCredentials = true
    const {body, resetBody, isediting, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, resetAid} = useQpgContext()
    const [ab, setAb] = useState(body)
    let rf = useRef(null)

    const {token, ckifloggedin} = useGlobalContext()

    // console.log("E ", 'edA', edA, body, isediting, rf)
    useEffect(() => {
        console.log('rf ', rf)
        if(rf.current !== null && isediting === true) {
            rf.current.scrollIntoView({behavior:'smooth'});
            // resetIsediting(false)
        }
    },[body, isediting])
    useEffect(() => {
        setAb(body)
    },[body])

    const handleSubmit = () => {
        //console.log('s ', ab)
        if(ab === ''){
            alert('Please fill up the answer field')
        } else {
            const nb = ab.replaceAll(`"`,`\\"`)
            Axios.post("http://localhost:8089/answers", {
                answer:nb,
                q_id:questionId,
            }, { headers:{"authorization": `${token}`}
            }).then((res) => {
                console.log(res)
                resetLoadAns((loadAns === true)?false:true)
                resetAid(res.data.insertId)
                resetBody('')
                resetEdA({})
                setAb('')
            }).catch((err) => {
                console.log(err)
                if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                    alert('Please login before posting an answer')
                    ckifloggedin(0)
                } else {
                    alert(err.response.data)
                }
            })
        }
    }

    // EDIT ANSWER
    const handleEdit = () => {
        //console.log('editing')
        if(ab === ''){
            alert('Please fill up the answer field')
        } else {
            const nb = ab.replaceAll(`"`,`\\"`)
            setOpenlnrprogbar(true)
            Axios.post("http://localhost:8089/answers/edit", {
                a_id:edA.a_id,
                u_id:edA.u_id,
                answer:nb,
            }, { headers:{"authorization": `${token}`}
            }).then((res) => {
                //console.log(res)
                setOpenlnrprogbar(false)
                if(res.data === 'Error communicating with DB server' || res.data === "You can not edit other's answer"){
                    handleSnackopen(res.data)
                } else {
                    //console.log('updated')
                    handleSnackopen(res.data)
                    resetAid(edA.a_id)
                    resetLoadAns((loadAns === true)?false:true)
                    resetBody('')
                    resetEdA({})
                    setAb('')
                    resetIsediting(false)
                }
            }).catch((err) => {
                //console.log(err)
                setOpenlnrprogbar(false)
                if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                    handleSnackopen('Please login before Editing')
                    //ckifloggedin(0)
                } else {
                    handleSnackopen(err.response.data)
                }
            })
        }
    }
    return(
        <>
            {
                openlnrprogbar?(
                    <Box sx={{ position:'fixed', width: '100%', top:'52px', zIndex:'222' }}>
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
            <h3 style={{marginLeft:'15px',marginTop:'35px',marginBottom:'10px',display:'flex'}} ref={rf}>
                {(isediting === true)?<>Post Edited Answer</>:<>Post Answer</>}
                {
                    (isediting)?(<>
                        <div className='canCleEdt' onClick={(e) => {
                            resetBody('')
                            resetEdA({})
                            setAb('')
                            resetIsediting(false)
                        }}>
                            cancel edit
                        </div>
                    </>
                    ):(<></>)
                }
            </h3>
            <div style={{marginTop:'15px', paddingTop:'30px'}} className='txtcont'>
                <textarea style={(isediting)?{borderColor:'red',boxShadow:'0 0 10px #f77070'}:{}} id='myanstxt' className="txtarea asktxtbody" required
                    value={ab}
                    onChange={(e) => {
                        setAb(e.target.value)
                    }}
                />
            </div>
            {/* instruction container.. */}
            <div className="instcont">
                <div className='instcodecont'>
                    ```
                    <code>code</code>
                    ```
                </div>
                <div className='instboldcont instboldcontd1'>**bold**</div>
                <div className='instboldcont instboldcontd2'>*italic*</div>
                <div className='instboldcont instboldcontd2' style={{fontStyle:"normal"}}> {'>'}qoute</div>
                <div className='instboldcont instboldcontd2' style={{fontStyle:"normal"}}> [link](address) </div>
            </div>
            {/* markdown container.. */}
            <div className="revcont">
                {/* This one WORKS */}
                <MarkDown text={ab} />
            </div>

            <div style={{display:"flex",flexDirection:"row",width:'100%',position:"relative", marginTop:"60px", marginBottom:"30px"}}>
                <div className='askpagesubmitbtncont'>
                    <button onClick={(isediting === false)?handleSubmit:handleEdit}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}



export default Editor;