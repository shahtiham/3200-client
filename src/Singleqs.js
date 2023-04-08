import './bodySection.css';
import voteup from './voteup.png'
import votedown from './votedown.png'
import edit from './edit.png'
import copy from './copy.png'

import CheckIcon from '@mui/icons-material/Check';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import questions from './qdata';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import React, { Fragment, useEffect, useState, useRef, useContext } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';
import Select from 'react-select'
import {useGlobalContext} from './Context'
import { optionsAnsOrSgtEdit } from './OptionsAnsOrSgtEdit';

import MarkDown from './MarkDown';
import Editor from './Editor';
import PagAsList from './PagAsList';
import PagSgtedtList from './PagSgtedtList';


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
const QpgContext = React.createContext()

function Singleqs() {
    //Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const location = useLocation();

    let [searchParams, setSearchParams] = useSearchParams(); // * 'http://localhost:3000/questions/1?aid=2' - the aid and so on
    const [tq, setTq] = useState({})
    const [aorSgtEdit, setAorSgtEdit] = useState('Answers')
    // Post answer
    const [body, setBody] = useState('')
    const [comm, setComm] = useState('')
    const [isediting, setIsediting] = useState(false)
    const [isbountyawarded, setIsbountyawarded] = useState(false)
    const [isbountyrunning, setIsbountyrunning] = useState(null)
    const [bountycreated, setbountycreated] = useState('')
    const [isprotected, setIsprotected] = useState(null)
    const [hasacceptedans, setHasacceptedans] = useState(false)
    const [edA, resetEdA] = useState({})
    const [loadAns, setLoadAns] = useState(false)
    const [loadq, setLoadq] = useState(false)
    const [aid, setAid] = useState(searchParams.get('aid'))

    let inputElement = useRef(null);
    console.log(inputElement, inputElement.current)

    const [openmodal, setOpenmodal] = useState(false);
    const [valuefromrepfield, setValuefromrepfield] = useState(null)
    const handleOpenmodal = () => {setOpenmodal(true);}
    const handleClosemodal = () => {setOpenmodal(false);}
    const handleChangerepfield = (value) => {
        setValuefromrepfield(value);
    }
    const [opensnackk, setOpensnackk] = useState(false);
    const [snackmsgg, setSnackmsgg] = useState('')
    const [openlnrprogbar, setOpenlnrprogbar] = useState(false)
    const handleSnackopenn = (v) => {
        setSnackmsgg(v)
        setOpensnackk(true)
    };
    const handleSnackclosee = () => {
        setOpensnackk(false)
    };
    
    const snackaction = (
        <Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackclosee}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
    );

    const resetLoadq = (val) => {
        setLoadq(val)
    }

    const resetLoadAns = (val) => {
        setLoadAns(val)
    }

    const resetAid = (val) => {
        setAid(val)
    }
    const resetIsediting = (val) => {
        setIsediting(val)
    }
    const resetBody = (val) => {
        setBody(val)
    }

    const {token,ckifloggedin,userId, socket} = useGlobalContext()
    const { questionId } = useParams() // * question id from url parameter
    
    const data = location.state?.qs; // * state passed on Link / navigate()


    // get the specific question from db
    //console.log(data, searchParams.get('aid')) // * data from state and 'aid' from url
    console.log('ge ', questionId, userId, tq, openmodal)

    useEffect(() => {
        Axios.get(`http://localhost:8089/questions/tagged/${questionId}/date`).then((res) => {
            setTq(res.data[0])
            setIsbountyawarded(res.data[0].bountyawarded > 0)
            setIsbountyrunning(res.data[0].isbountyrunning)
            setbountycreated(res.data[0].bountycreated)
            setIsprotected(res.data[0].isprotected)
            setHasacceptedans(res.data[0].acceptedanswer !== null)
            console.log(res.data[0]) // * getting specific question
        })
    },[loadq])

    const relFn = () => {
        Axios.get(`http://localhost:8089/questions/tagged/${questionId}/date`).then((res) => {
            // setTq(res.data[0])
            setIsbountyawarded(res.data[0].bountyawarded > 0)
            setIsbountyrunning(res.data[0].isbountyrunning)
            setbountycreated(res.data[0].bountycreated)
            setIsprotected(res.data[0].isprotected)
            setHasacceptedans(res.data[0].acceptedanswer !== null)
            resetLoadAns(loadAns === true?false:true)
            //console.log(res.data[0]) // * getting specific question
        })
    }
    useEffect(() => {
        // socket.on("from_cron", (data) => {
        //     console.log('calling')
        //     Axios.get(`http://localhost:8089/questions/tagged/${questionId}/date`).then((res) => {
        //         // setTq(res.data[0])
        //         setIsbountyawarded(res.data[0].bountyawarded > 0)
        //         setIsbountyrunning(res.data[0].isbountyrunning)
        //         setbountycreated(res.data[0].bountycreated)
        //         setIsprotected(res.data[0].isprotected)
        //         setHasacceptedans(res.data[0].acceptedanswer !== null)
        //         resetLoadAns(loadAns === true?false:true)
        //         //console.log(res.data[0]) // * getting specific question
        //     })
        // })
        socket.on("failed_to_aw_b", (data) => {
            console.log(data)
            relFn()
        })
        socket.on("not", (data) => {
            relFn()
        })
    },[socket])

    // useEffect(() => {
    //     //const interval = setInterval(() => {
    //         console.log('calling')
    //         Axios.get(`http://localhost:8089/questions/tagged/${questionId}/date`).then((res) => {
    //         // setTq(res.data[0])
    //         setIsbountyawarded(res.data[0].bountyawarded > 0)
    //         setIsbountyrunning(res.data[0].isbountyrunning)
    //         setbountycreated(res.data[0].bountycreated)
    //         setIsprotected(res.data[0].isprotected)
    //         setHasacceptedans(res.data[0].acceptedanswer !== null)
    //         resetLoadAns(loadAns === true?false:true)
    //         //console.log(res.data[0]) // * getting specific question
    //     })
    //     // socket.emit("send_msg", {message: "hello f"})
    //     //}, 1000);
    //     //return () => clearInterval(interval);
    // }, [socket])

    const handlevote = async (e) => {
        //console.log(e) // * Voting on the specific question
        let isU = (e.target.id === 'qbp')?'u':'d'
        Axios.get('http://localhost:8089/vote/'+isU.toString()+'/q/'+questionId.toString(), {headers:{"authorization": `${token}`}}).then((res) => {
            //console.log(res)
            let vot = (tq.votes === null)? 0: tq.votes
            if(res.data === 'Error communicating with DB server' || res.data === "not allowed to vote on you'r questions" || res.data === 'Already Voted'){
                handleSnackopenn(res.data)
            } else {
                if(e.target.id === 'qbp'){
                    setTq({...tq, votes: vot + 1})
                } else {
                    setTq({...tq, votes: vot - 1})
                }
            }
        }).catch((err) => {
            if(err.response.data === "A token is required for authentication" || err.response.data === "Invalid Token"){
                handleSnackopenn('Please login before you vote')
                ckifloggedin(0)
            } else {
                handleSnackopenn(err.response.data)
            }
        })
      
    }

    const hndlcpy = (lnk) => {
        //console.log(key,document.getElementById('linkNotify').classList)
        navigator.clipboard.writeText(lnk).then(()=>{
            if(!document.getElementById('linkNotify').classList.contains('show')){
                document.getElementById('linkNotify').classList.add('show')
                  setTimeout(() => {
                      document.getElementById('linkNotify').classList.remove('show')
                }, 2000);
            }
        })
    }

    const handlestartbounty = () => {
        if(tq === null || tq === undefined || tq === {} || tq.q_id === null || tq.q_id === undefined || valuefromrepfield === null || valuefromrepfield === ''){
            handleSnackopenn('Bounty value is required')
            return
        }
        if(isNaN(parseInt(valuefromrepfield)) || !isFinite(valuefromrepfield)){
            handleSnackopenn('Enter a valid bounty between 50 and 500')
            return
        }
        const val = parseInt(valuefromrepfield)
        if(val < 50 || val > 500){
            handleSnackopenn('Enter a valid bounty between 50 and 500')
            return
        }
        setOpenlnrprogbar(true)
        Axios.post('http://localhost:8089/setbounty', {
            q_id:tq.q_id,
            bountyvalue:val
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            setOpenlnrprogbar(false)
            handleSnackopenn(res.data)
            if(res.data === 'Bounty started successfully'){
                setValuefromrepfield(null)
                handleClosemodal() // closes modal
                resetLoadq(loadq === true?false:true)
            }
        }).catch((err) => {
            setOpenlnrprogbar(false)
            handleSnackopenn(err.response.data)
        })
    }

    const handleCommUsfl = (cm) => {
        const id = cm.id
        Axios.get(`http://localhost:8089/vote/u/cq/${id}`, {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopenn('Successfully voted as useful')
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            handleSnackopenn(err.response.data)
        })
    }

    const handleComs = () => {
        const nb = comm.replaceAll(`"`,`\\"`)
        if(comm === null || comm === undefined || comm === ''){
            handleSnackopenn("invalid comment")
            return
        }
        setOpenlnrprogbar(true)
        Axios.post('http://localhost:8089/comm/question', {
            qid:tq.q_id,
            comment:nb
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            setComm('')
            setOpenlnrprogbar(false)
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            setOpenlnrprogbar(false)
            handleSnackopenn(err.response.data)
        })
    }

    return(
        <>
            {
                openlnrprogbar?(
                    <Box sx={{ position:'fixed', width: '100%', top:'52px' }}>
                        <LinearProgress />
                    </Box>
                ):(
                    <></>
                )
            }
            <Snackbar
                open={opensnackk}
                autoHideDuration={6000}
                onClose={handleSnackclosee}
                message={snackmsgg}
                action={snackaction}
            />
            <Modal
                open={openmodal}
                onClose={handleClosemodal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{display:'flex'}}>
                        <TextField
                            style={{width:'300px'}}
                            id="outlined-multiline-flexible"
                            label="Bounty"
                            multiline
                            maxRows={4}
                            value={valuefromrepfield}
                            onChange={(e)=>handleChangerepfield(e.target.value)}
                        />
                        
                        <Button style={{right:'10px',position:'absolute', top:'35%'}} variant="outlined" onClick={handlestartbounty}>
                            start
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <div className='sec2q'>
                {/* QUESTION PART BEGIN */}
                <div className='qlist'>
                    <div className='ansidcont'>
                        {/* TODO[done] */}
                        <img style={{zIndex:'1'}} onClick={(e)=>hndlcpy(`http://localhost:3000/questions/${questionId}`)} 
                        src={copy} title='Copy link'/>
                    </div>

                    <div className='qitem' style={{position:'relative'}}>
                        {/* The question */}
                        <h2 className='singleqshead'>{tq.title}</h2>
                        {
                            isbountyawarded !== null && isbountyawarded === false && isbountyrunning === false?(
                            <>
                                <Tooltip  title="start bounty">
                                    <CurrencyExchangeIcon style={{position:'absolute', bottom:'5px', right:'5px'}} fontSize='small' onClick={()=>{handleOpenmodal()}} />
                                </Tooltip>
                            </>
                            ):(<></>)
                        }
                        
                    </div>
                </div>
                {/* here should be question description : begin*/}
                
                <div style={{position:'relative'}} className="revcont">
                    {/* This one WORKS */}
                    {/* *** MAKE THIS SEPARATE COMPONENT and use here, answer list, post answer and in Ask page */}
                    <MarkDown text={tq.question} />

                    {/* Edit question... */}
                    <img className='editic' onClick={(e)=>{
                        window.scrollTo({top:0,behavior:'smooth'})
                        navigate('/ask', {state:tq})
                    }} 
                    src={edit} title='Edit to improve'/>
                </div>
                {/* here should be question description : end*/}

                {/* Vote count and info.. begin */}
                <div className='sqdvcont'>
                    {/* <div className='sqtc'>Tag : {tq.tag}</div> */}
                    {
                        tq.tag?.map((tg) => {
                            return(
                                <div className="multitagcont">
                                    <a href='#' style={{pointerEvents:'none', backgroundColor:'hsl(205,46%,92%)', textDecoration:'none', 
                                        color:'hsl(205,47%,42%)',marginBottom:'4px',marginTop:'4px', paddingLeft:'6px', paddingRight:'6px', paddingBottom:'2px', borderRadius:'4px',fontSize:'12px'}}
                                    >{tg.tag}</a>
                                </div>
                            );
                        })
                    }
                </div>
                <div className='sqdvcont'>
                    <button className='sqbp sqbstyle'>
                        <img id='qbp' onClick={(e)=>handlevote(e)}
                        style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                        src={voteup} />
                    </button>
                
                    <div className='sqvcc'>{(tq.votes === null)? `0 Votes`:`${tq.votes} Votes` }</div>

                    <button className='sqbm sqbstyle'>
                        <img id='qbm'  onClick={(e)=>handlevote(e)}
                        style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                        src={votedown} />
                    </button>

                    <div className='sqab'>
                        <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${tq.u_id}`}>
                            {tq.username}
                        </Link>
                        &nbsp;asked on {(new Date(tq.created)).toString().split('GMT')[0]}
                    </div>
                </div>
                    {/* Testing comm sec for question */}

                {/* <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography style={{marginLeft:'20px', fontSize:'12px', fontWeight:'530' }}>Write Comment</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <textarea id='mytxt' className="txtarea asktxtbody" style={{minHeight:'100px', marginBottom:'20px'}} required
                            value={comm}
                            onChange={(e) => {
                                setComm(e.target.value)
                            }}
                        />
                        <Button variant="contained" color="success" size='small' onClick={(e) => {handleComs()}}>
                            Comment
                        </Button>
                    </AccordionDetails>
                </Accordion>

                
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography style={{marginLeft:'20px', fontSize:'12px', fontWeight:'530' }}>Show Comments</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            (tq.quscomments !== null && tq.quscomments !== undefined && tq.quscomments.length !== 0)?(
                                <>
                                    {
                                        tq.quscomments?.map((cm) => {
                                            let d = new Date(cm.date)
                                            return(
                                                <Typography key={cm.id} style={{borderBottom:'1px solid gray'}}>
                                                    <div style={{display:'flex', flexDirection:'row', position:'relative'}}>
                                                        <div style={{display:'flex', flexDirection:'column', borderRight:'1px solid black', alignItems:'center', justifyContent:'center', width:'70px', height:"inherit"}}>
                                                            <div className='hoverPointdisblk'><ThumbUpOffAltIcon onClick={(e) => {handleCommUsfl(cm)}}/></div>
                                                            <div> + {cm.votes}</div>
                                                        </div>
                                                        <div style={{position:'relative', display:'flex', width:'100%', fontSize:'12px'}} className='revcont'>
                                                            <MarkDown text={cm.comment} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className='sqdvcont'>
                                                        <div className='sqab' style={{fontSize:'12px', fontWeight:'530' }}>
                                                            <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${cm.qcommentedBy.id}`}>
                                                                {cm.qcommentedBy.username} 
                                                            </Link>
                                                            &nbsp;commented on {d.toString().split('GMT')[0]}
                                                        </div>
                                                    </div>
                                                </Typography>
                                            );
                                        })
                                    }
                                </>
                            ):(<></>)
                        }
                    </AccordionDetails>
                </Accordion> */}
                
                    {/* Test */}
                    {/* QUESTION PART END */}

                    {/* ANSWER LIST PART BEGIN */}
                {
                    token === null || (userId !== null && userId !== tq.u_id)?(
                        <>
                            <h1 style={{position:'relative',marginLeft:'10px'}}>Answers</h1>
                            {/* Send question id and (aid = a answer id : may not exist, if exists -> show the answer page where this answer lies) */}
                            
                            <QpgContext.Provider value={{body, resetBody, inputElement, isediting, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, loadq, resetLoadq, aid, resetAid, isbountyawarded, isbountyrunning, bountycreated, isprotected, hasacceptedans}}>
                                <PagAsList qid={questionId} />
                                <Editor />
                            </QpgContext.Provider>
                        </>
                    ):(
                        <>
                            <div style={{marginLeft:'10px', position:'relative',marginTop:'10px', width:'200px'}}>
                                <Select isMulti={false} options={optionsAnsOrSgtEdit} defaultValue={optionsAnsOrSgtEdit.find((e)=> e.label === aorSgtEdit)} onChange={(e)=>{
                                    setAorSgtEdit(e.label)
                                }}/>
                            </div>
                            {
                                aorSgtEdit === 'Answers'?(
                                    <>
                                        <h1 style={{position:'relative',marginLeft:'10px'}}>Answers</h1>
                                        {/* Send question id and (aid = a answer id : may not exist, if exists -> show the answer page where this answer lies) */}
                                        
                                        <QpgContext.Provider value={{body, resetBody, inputElement, isediting, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, loadq, resetLoadq, aid, resetAid, isbountyawarded, isbountyrunning, bountycreated, isprotected, hasacceptedans}}>
                                            <PagAsList qid={questionId} />
                                            <Editor />
                                        </QpgContext.Provider>
                                    </>
                                ):(
                                    <>
                                        <h1 style={{position:'relative',marginLeft:'10px'}}>Suggested Edits</h1>
                                        {/* Send question id and (aid = a answer id : may not exist, if exists -> show the answer page where this answer lies) */}
                                        
                                        <QpgContext.Provider value={{body, resetBody, isediting, inputElement, resetIsediting, edA, resetEdA, questionId, loadAns, resetLoadAns, loadq, resetLoadq, aid, resetAid, isbountyawarded, isbountyrunning, bountycreated, isprotected, hasacceptedans}}>
                                            <PagSgtedtList itms={tq.suggestededit} />
                                        </QpgContext.Provider>
                                    </>
                                )
                            }
                            
                        </>
                    )
                }
                

            </div>
        </>

    );
}

export const useQpgContext = () => {
    return useContext(QpgContext)
}

// Here was Editor

// Here was PagSgtedtList

// Here was PagAsList

export default Singleqs;