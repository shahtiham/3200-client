import './bodySection.css';

import { useState,useEffect, useRef, Fragment } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { options } from './Options';
import Select from 'react-select'

import Axios from 'axios'
import {useGlobalContext} from './Context'

import MarkDown from './MarkDown';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function Ask() {
    //Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const {token, ckifloggedin, tagsfromdb, gettagsfromdb} = useGlobalContext()
    const location = useLocation(); // ** Get data (question object) from singleqs.js to edit // TODO[done]

    const [title, setTitle] = useState((location.state !== null)?(location.state.title):(localStorage.getItem('askingT') === null ||localStorage.getItem('askingT') === undefined)?'':
    localStorage.getItem('askingT'))
    const [body, setBody] = useState((location.state !== null)?(location.state.question):(localStorage.getItem('askingB') === null ||localStorage.getItem('askingB') === undefined)?'':
    localStorage.getItem('askingB'))

    const fnf = []
    console.log(location.state)
    if(location.state !== null && location.state !== undefined){
        location.state.tag.forEach((e)=>{
            fnf.push({
                value:e.tag,
                label:e.tag
            })
        })
    }
    useEffect(() => {
        gettagsfromdb(0)
    }, [])

    function gettags(e){
        let tgs = []
        e.forEach((e)=> tgs.push(e.tag))
        return tgs
    }

    const [tag, setTag] = useState((location.state !== null)?(gettags(location.state.tag)):[])
    
    //console.log(fnf, title, tag, location.state)

    const txtar = useRef()
    //console.log(txtar.current?.selectionStart, body)

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

    const handleSubmit = () => {
        if(tag.length === 0){
            alert("Please set tag")
        }
        else if(title === '' || body === ''){
            alert("Please fill-up all the fields")
        } else {
            const tb = title.replaceAll(`"`,`\\"`)
            const nb = body.replaceAll(`"`,`\\"`)
            /* https://tiham.herokuapp.com/ */
            Axios.post("http://localhost:8089/questions", {
                title:tb,
                question:nb,
                tag:tag,
            }, { headers:{"authorization": `${token}`}}).then((res) => {
                console.log(res)
                if(res.data === 'Error communicating with DB server'){
                    alert(res.data)
                } else {
                    localStorage.setItem('askingT','')
                    localStorage.setItem('askingB','')
                    window.scrollTo({top:0,behavior:'smooth'})
                    navigate(`/questions/${res.data.insertId}`)
                }
            }).catch((err) => {
                console.log(err)
                if(err.response.data === 'Invalid Token'){
                    alert('Please login before asking a question')
                    ckifloggedin(0)
                } else {
                    alert('Unknown error occured')
                }
            })
        }
    }

    const handleEdit = () => {
        //console.log('edited')
        const tb = title.replaceAll(`"`,`\\"`)
        const nb = body.replaceAll(`"`,`\\"`)
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/questions/edit", {
            q_id:location.state.q_id,
            u_id:location.state.u_id,
            title:tb,
            question:nb,
            tag:tag,
        } , { headers:{"authorization": `${token}`}
        }).then((res) => {
            //console.log(res)
            setOpenlnrprogbar(false)
            window.scrollTo({top:0,behavior:'smooth'})
            console.log(navigate)
            navigate(`/questions/${location.state.q_id}`)
        }).catch((err) => {
            //console.log(err)
            setOpenlnrprogbar(false)
            if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                handleSnackopen('Please login before Editing a question')
                ckifloggedin(0)
            } else {
                handleSnackopen(err.response.data)
            }
        })
    }

    const handletxtareaonchange = (e) => {
        setBody(e.target.value)
        if(location.state === null)localStorage.setItem('askingB',e.target.value)
    }
    
    const [ss, setSs] = useState(null)
    const [se, setSe] = useState(null)

    //console.log(ss, se)

    return(
        <>
            {
                openlnrprogbar?(
                    <Box sx={{ position:'fixed', width: '100%', top:'52px', zIndex:"2" }}>
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
            <div className='sec2q'>
                <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Title</h3>
                <div className='txtcont'>
                    <textarea id='mytitle' className="txtarea asktxttitle" required
                        value={title}
                        ref={txtar}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            if(location.state === null)localStorage.setItem('askingT',e.target.value)
                        }}
                    />
                </div>

                <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Question</h3>
                <div className='txtcont'>
                    <textarea id='mytxt' className="txtarea asktxtbody" required
                        value={body}
                        onChange={(e) => {
                            handletxtareaonchange(e)
                            //console.log(e)
                        }}
                        onKeyDown={(e) => {
                            //console.log(e)
                            if(e.key === "Tab"){
                                e.preventDefault()
                                const st = e.target.selectionStart
                                e.target.value = e.target.value.substring(0,e.target.selectionStart) + "    " + e.target.value.substring(e.target.selectionStart)
                                e.target.selectionStart = st + 4
                                e.target.selectionEnd = st  + 4
                                //console.log(e)
                            }
                        }}
                        onClick={(e)=>{
                            //setSs(e.target.selectionStart)
                            //setSe(e.target.selectionEnd)
                        }}
                        onSelect={(e) => {
                            //console.log(e)
                            if(e.target.selectionStart !== e.target.selectionEnd){
                                /* console.log(e)
                                e.target.value = e.target.value.substring(0,e.target.selectionStart) + '\n' + e.target.value.substring(e.target.selectionStart)
                                handletxtareaonchange(e) */
                            }
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
                    <a style={{textDecoration:'none',cursor:'pointer'}} href="https://stackoverflow.com/editing-help" target="_blank" rel="noopener noreferrer">More</a>
                </div>
                {/* markdown container.. */}
                <div className="revcont">
                    {/* This one WORKS */}
                    <MarkDown text={body} />
                </div>
                
                <h3 style={{marginLeft:'15px',marginTop:'25px',marginBottom:'10px'}}>Tag</h3>
                
                <div style={{display:"flex",flexDirection:"row",width:'100%',position:"relative",}}>
                    <div style={{position:"relative",boxSizing:"border-box",display:"inline-block",width:"300px",marginLeft:"10px",marginBottom:"120px"}}>
                        <Select isMulti={true} options={tagsfromdb} defaultValue={fnf/* (tag!=='')?tag:'all' */} onChange={(e)=>{
                            let chtag = []
                            e.forEach((e)=>chtag.push(e.label))
                            setTag(chtag)
                            console.log(chtag)//
                        }}/>
                    </div>
                    <div className='askpagesubmitbtncont'>
                        <button onClick={(location.state === null)?handleSubmit:handleEdit}>
                            Submit
                        </button>
                    </div>
                </div>
                
                <div className='dummydiv'></div>
                

            </div>
        </>
        
    );
}

export default Ask;