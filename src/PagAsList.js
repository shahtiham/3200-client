import './bodySection.css';
import voteup from './voteup.png'
import votedown from './votedown.png'
import edit from './edit.png'
import copy from './copy.png'

import CheckIcon from '@mui/icons-material/Check';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Modal from '@mui/material/Modal';

import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import React, { Fragment, useEffect, useState, useRef, useContext } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';
import Select from 'react-select'
import {useGlobalContext} from './Context'
import { useQpgContext } from './Singleqs';
import remove from './remove.png'

import MarkDown from './MarkDown';

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
    height: '50px'
};

function PagAsList({qid}) {
    const {body, resetBody,  inputElement, isediting, resetIsediting, resetEdA, loadAns, loadq, resetLoadq, aid, resetAid, isbountyawarded, isbountyrunning, bountycreated, isprotected, hasacceptedans} = useQpgContext()

    //Axios.defaults.withCredentials = true
    const {token,ckifloggedin, userRep, userRole} = useGlobalContext()
    // let inputElement = useRef();
    let ival = 0
    const itemsPerPage = 3
    const [items, setItems] = useState([])
    const [prevtag, setPrevtag] = useState(0)

    const [rer, setRer] = useState(-1)
    const [nrer, setNrer] = useState(0)

    const delaid = useRef(null)
    const [openmodal, setOpenmodal] = useState(false);
    const handleOpenmodal = () => {setOpenmodal(true);}
    const handleClosemodal = () => {delaid.current = null; setOpenmodal(false);}

    const [comm, setComm] = useState('')
    //console.log(loadAns)
    // Getting answers for given qid on first PagAsList component render
    useEffect(()=>{
        Axios.get(`http://localhost:8089/answers/${qid}`).then((resAns) => {
            //console.log(resAns)
            setItems(resAns.data)
        })
    },[loadAns, loadq, isbountyawarded, nrer])
    // console.log(items)
    useEffect(()=>{
        if(aid === null || aid === undefined || items.length === 0) ival = 0
        else {
            // *** setting the page (prevtag, default:0) according to 'aid'
            let n = parseInt(aid)
            const cival = items.find((it, index) => {
                if(it.a_id === n) {
                    setPrevtag(Math.floor(index / itemsPerPage))
                    return true
                } 
            })
        }
    },[aid,items])
    
    
    //console.log('it ', items,'ai ', aid,ival,prevtag, inputElement)
    // console.log('33', inputElement.current,inputElement,aid, rer)
    useEffect(()=>{
        console.log(inputElement, inputElement.current, aid)
        if(inputElement.current !== null && inputElement.current != undefined) {
            inputElement.current.scrollIntoView({
                behavior: "smooth",
            });
 
            // This part resets aid and current to null so that only once scroll happens...
            inputElement.current = null
            resetAid(null)
        } else if(inputElement.current === null){
            /* window.scrollTo({
                top:0,
                behavior:"smooth",
            }) */
        }
    },[inputElement.current, aid])
    

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    

    // console.log("pag rend", pageCount, itemOffset, "initpage: ", initialpage, items, currentItems)
    console.log(aid, inputElement.current)

    useEffect(() => {
        const pc =(items === undefined || items === null || items.length === 0)? 0 : Math.ceil(items.length / itemsPerPage)
        if(prevtag >= pc){
            const nwofst = 0
            const initpg = 0
            setPageCount(pc)
            setInitialpage(initpg)
            setCurrentItems(items.slice(nwofst, nwofst + itemsPerPage))
        } else {
            const nwofst = (items === undefined || items === null || items.length === 0)? 0 : (prevtag * itemsPerPage) % items.length
            setPageCount(pc)
            setInitialpage(prevtag)
            setCurrentItems(items.slice(nwofst, nwofst + itemsPerPage))
        }
    }, [itemOffset, itemsPerPage, items, initialpage, prevtag, rer]);

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

    function updp(event){
        return new Promise(async (resolve, reject) => {
            inputElement.current = null
            setPrevtag(event.selected)
            resolve()
        })
    }
    const handlePageClick = async (event) => {
        // do this inst.
        try{
            const wait = await updp(event)
        }catch{
            //console.log('reject')
        }
    };

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

    const handlevote = (e, key) => {
        let isU = (e.target.id === 'abp')?'u':'d'
        //console.log(isU)
        Axios.get('http://localhost:8089/vote/'+isU.toString()+'/a/'+key.toString(), {headers:{"authorization": `${token}`}}).then((res) => {
            //console.log(res)
            if(res.data === 'Error communicating with DB server' || res.data === "not allowed to vote on you'r answers" || res.data === 'Already Voted'){
                alert(res.data)
            } else {
                Axios.get(`http://localhost:8089/answers/${qid}`).then((resAns) => {
                    //console.log(resAns)
                    setItems(resAns.data)
                })
            }
        }).catch((err) => {
            if(err.response.data === "A token is required for authentication" || err.response.data === "Invalid Token"){
                alert('Please login before you vote')
                ckifloggedin(0)
            } else {
                alert(err.response.data)
            }
        })
    }

    const handleAcceptans = (a_id, q_id, u_id) => {
        setOpenlnrprogbar(true)
        Axios.post('http://localhost:8089/acceptanswer', {
            a_id:a_id,
            u_id:u_id,
            q_id:q_id
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setOpenlnrprogbar(false)
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            handleSnackopen(err.response.data)
            setOpenlnrprogbar(false)
        })
    }

    const handleAwardbounty = (a_id, q_id, u_id) => {
        setOpenlnrprogbar(true)
        Axios.post('http://localhost:8089/awardbounty', {
            a_id:a_id,
            q_id:q_id,
            u_id:u_id
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setOpenlnrprogbar(false)
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            handleSnackopen(err.response.data)
            setOpenlnrprogbar(false)
        })
    }

    const handleCommUsfl = (cm) => {
        const id = cm.id
        Axios.get(`http://localhost:8089/vote/u/ca/${id}`, {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen('Successfully voted as useful')
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
    }

    const handleComs = (as) => {
        const nb = comm.replaceAll(`"`,`\\"`)
        if(comm === null || comm === undefined || comm === ''){
            handleSnackopen("invalid comment")
            return
        }
        setOpenlnrprogbar(true)
        Axios.post('http://localhost:8089/comm/answer', {
            aid:as.a_id,
            comment:nb
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            setComm('')
            setOpenlnrprogbar(false)
            resetLoadq(loadq === true?false:true)
        }).catch((err) => {
            setOpenlnrprogbar(false)
            handleSnackopen(err.response.data)
        })
    }

    const handleadel = (as) => {
        console.log(as)
        delaid.current = as.a_id
        setOpenmodal(true)
    }
    const delans = () => {
        if(userRole === 'USER'){
            handleSnackopen('You can not delete an answer')
            return
        }
        Axios.post('http://localhost:8089/deleteanswer', {
            a_id: delaid.current
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setNrer(nrer === 0?1:0)
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
        delaid.current = null
    }

    //console.log(isbountyawarded)
    return (
        <>
            {
                openlnrprogbar?(
                    <Box sx={{ position:'fixed', width: '100%', top:'52px', zIndex:'2' }}>
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
            <Modal
                open={openmodal}
                onClose={handleClosemodal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{display:'flex'}}>
                        Are you sure you want to delete this answer?                     
                        <Button style={{position:'absolute', top:'55%', left:'20%'}} color='success' variant="contained" size="small" onClick={(e)=> {
                            setOpenmodal(false)
                            delans()
                        }}>
                            YES
                        </Button>
                        <Button style={{position:'absolute', top:'55%', left:'70%'}} color='error' variant="contained" size="small" onClick={(e)=> handleClosemodal()}>
                            NO
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <div id='linkNotify' className='notify'>Link copied to clipboard</div>
            <ReactPaginate
                breakLabel="..."
                nextLabel={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path data-v-a2c62ba0="" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                forcePage={initialpage}
                previousLabel={<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path data-v-a2c62ba0="" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg>}
                renderOnZeroPageCount={null}
                containerClassName="PagQsListpagination"
                pageLinkClassName="PagQsListpagenum"
                previousLinkClassName="PagQsListpagenum"
                nextLinkClassName="PagQsListpagenum"
                activeLinkClassName="PagQsListactive"
            />
            {
                (currentItems !== null && currentItems.length !== 0)?(
                    <>
                        {
                            currentItems?.map((as) => {//console.log(isbountyrunning)
                                let d = new Date(as.date)
                                console.log( as.a_id, aid, rer, inputElement)
                                if((aid !== null && aid !== undefined && 
                                    currentItems?.length !== 0 && aid.toString() === (as.a_id).toString()) && rer === -1){
                                        setRer(rer + 1)
                                    }
                                return(
                                    <div key={as.a_id}>{/*<div className='qlist anlist' key={as.a_id}>*/}

                                        <div style={{display:'flex', flexDirection:'row', position:'relative'}}>
                                            <div style={{display:'flex', flexDirection:'column', borderRight:'1px solid black', alignItems:'center', justifyContent:'center', width:'70px', height:"100px"}}>
                                                {
                                                    isbountyawarded === true?(
                                                        <>
                                                            {
                                                                as.isaccepted === true?(
                                                                    <>
                                                                        <Tooltip title="Accepted">
                                                                            <CheckIcon fontSize="large" color='success' />
                                                                        </Tooltip>
                                                                        {
                                                                            as.bountyreceived > 0?(
                                                                                <Tooltip title="bounty awarded">
                                                                                    <p style={{fontSize:'14px', fontWeight:'600'}}> + {as.bountyreceived}</p>
                                                                                </Tooltip>
                                                                            ):(<></>)
                                                                        }
                                                                    </>
                                                                ):(
                                                                    <>

                                                                    </>
                                                                )
                                                            }
                                                        </>
                                                    ):(
                                                        <>
                                                            {
                                                                hasacceptedans === true?(
                                                                    <>
                                                                        {
                                                                            as.isaccepted === true?(
                                                                                <Tooltip title="Accepted">
                                                                                    <CheckIcon fontSize="large" color='success' />
                                                                                </Tooltip>
                                                                            ):(<> </>)
                                                                        }
                                                                    </>
                                                                ):(
                                                                    <>
                                                                        {
                                                                            isbountyrunning === true?(
                                                                                <>
                                                                                    {
                                                                                        (new Date(as.date)) > (new Date(bountycreated))?(
                                                                                            <Tooltip title="Award Bounty and Mark as Accepted">
                                                                                                <AddTaskIcon fontSize="large" color='success' onClick={(e) => { handleAwardbounty(as.a_id, as.q_id, as.u_id) }} />
                                                                                            </Tooltip>
                                                                                        ):(<></>)
                                                                                    }
                                                                                </>
                                                                            ):isbountyrunning !== null ? (
                                                                                <>
                                                                                    <Tooltip title="Mark as Accepted">
                                                                                        <CheckCircleIcon fontSize='large' onClick={(e) => { handleAcceptans(as.a_id, as.q_id, as.u_id) }} />
                                                                                    </Tooltip>
                                                                                </>
                                                                            ):(<></>)
                                                                        }
                                                                    </>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                                
                                            </div>
                                            <div style={{position:'relative', display:'flex', width:'100%'}} className='revcont'> {/* here class was : qitem*/}
                                                <div id={as.a_id} style={{overflowY: 'visible'}} className='ansidcont' ref={(aid !== null && aid !== undefined && 
                                                currentItems?.length !== 0 && aid.toString() === (as.a_id).toString())?(
                                                    inputElement
                                                ):(null)}>
                                                    <img onClick={(e)=>hndlcpy(`http://localhost:3000/questions/${qid}?aid=${as.a_id}`)} 
                                                    src={copy} title='Copy link'/>
                                                </div>
                                                {
                                                    userRole === 'ADMIN' || userRole === 'MODERATOR'?(
                                                        <div style={{position:'absolute', display:'flex', bottom:'10px',right:'4px' , width: '20px', height:'20px', overflow:'hidden'}}>
                                                            <img style={{cursor:'pointer'}} src={remove} title='Delete answer'
                                                            onClick={(e) => handleadel(as)} />
                                                        </div>
                                                    ):(<></>)
                                                }

                                                <MarkDown text={as.answer} />

                                                {/* Edit answer... */}
                                                {<img className='editic' onClick={(e)=>{
                                                    resetEdA(as)
                                                    resetBody(as.answer)
                                                    resetIsediting(true)
                                                    //navigate('/ask', {state:tq})
                                                }} 
                                                src={edit} title='Edit'/>}
                                            </div>
                                        </div>
                                        

                                        <div className='sqdvcont'>
                                            <button className='sqbp sqbstyle'>
                                                <img id='abp' onClick={(e)=>handlevote(e, as.a_id)}
                                                style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                                                src={voteup} />
                                            </button>
                                        
                                            <div className='sqvcc'>{(as.votes === null)? `0 Votes`:`${as.votes} Votes` }</div>

                                            <button className='sqbm sqbstyle'>
                                                <img id='abm' onClick={(e)=>handlevote(e, as.a_id)}
                                                style={{width:"100%",heigth:'100%',transform:"scale(1.5,1.5)"}} 
                                                src={votedown} />
                                            </button>

                                            <div className='sqab'>
                                                <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${as.u_id}`}>
                                                    {as.username} 
                                                </Link>
                                                &nbsp;answered on {d.toString().split('GMT')[0]}
                                            </div>
                                        </div>{/* </div> */}

                                        <Accordion>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            >
                                            <Typography style={{marginLeft:'20px', fontSize:'12px', fontWeight:'530' }}>Write Comment</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <textarea id='mycomtxt' className="txtarea asktxtbody" style={{minHeight:'100px', marginBottom:'20px'}} required
                                                    value={comm}
                                                    onChange={(e) => {
                                                        setComm(e.target.value)
                                                    }}
                                                />
                                                <Button variant="contained" color="success" size='small' onClick={(e) => {handleComs(as)}}>
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
                                                    (as.anscomments !== null && as.anscomments !== undefined && as.anscomments.length !== 0)?(
                                                        <>
                                                            {
                                                                as.anscomments?.map((cm) => {
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
                                                                                    <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${cm.anscommentedBy.id}`}>
                                                                                        {cm.anscommentedBy.username} 
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
                                        </Accordion>

                                        <div style={{height:'1px', width:'100%',marginBottom:"50px",boxShadow:"0 1px 0px rgba(0,0,0,0.15),0px -1px rgba(0,0,0,0.1)"}}></div>
                                    </div>
                                );
                            })
                        }
                    </>
                ):(<h4 style={{position:'relative',marginLeft:'40px', fontWeight:'400'}}>No Answer Available</h4>)
                
            }
        </>
    );
}



export default PagAsList;