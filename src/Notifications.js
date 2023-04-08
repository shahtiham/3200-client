import './bodySection.css'
import Button from '@mui/material/Button';

import { Link, useParams, useLocation } from 'react-router-dom'

import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';
import {useGlobalContext} from './Context'

import Select from 'react-select'
import { optionsUqa } from './OptionsUqa';
import { optionsOdv } from './OptionsOdv';
import { optionsRepordate } from './optionsRepordate';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


// TODO: Implement notific in db, frontend, backend
function Notifications() {
    //Axios.defaults.withCredentials = true
    // const { userId } = useParams() // * user id from url parameter
    // const [userName, setUserName] = useState('')
    const {userName, userId, userEmail, isuserBlocked, userRole, userRep, socket, hn, resetnn, token} = useGlobalContext()
    const location = useLocation()
    // console.log(location?.pathname, location)
    console.log(userName, userEmail)

    const [tag, setTag] = useState('questions')
    const [odrby, setOdrby] = useState('date')
    const [rer, setRer] = useState(0)
    const [items, setItems] = useState([])
    //console.log(items)

    const setnncnt2z = () => {
        Axios.get("http://localhost:8089/setnncnt2z/" + userEmail, {headers:{"authorization": `${token}`}})
        .then((res) => {
            //console.log(res)
            hn.current = 0
            resetnn(0)
        })
        .catch((err) => {
            console.log(err)
            //hn.current = 0
            //resetnn(0)
        })
    }
    const getnotifics = () => {
        Axios.get("http://localhost:8089/getnotifics/" + userEmail, {headers:{"authorization": `${token}`}})
        .then((res) => {
            console.log(res)
            setItems(res.data.mynotifics)
        })
        .catch((err) => {console.log(err)})
    }

    useEffect(() => {
        if(userEmail !== null && userEmail !== undefined) {
            getnotifics()
            setnncnt2z()
        }
    },[])
    useEffect(() => {
        socket.on("not", (data) => {
            // setnncnt2z()
            if(userEmail !== null && userEmail !== undefined) getnotifics()
        })
    }, [socket])

    return(
        <>
            {
                (token === null || token === undefined)?(
                    <>
                        <div style={{display:'flex', position:'relative', width:'100%', height:'1000px', justifyContent:'center'}}>
                            <div style={{top:'25%', position:'relative'}} >
                                Please&nbsp;
                                <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/login'>Log in</Link>
                                &nbsp;to see notifications
                            </div>
                        </div>
                    </>
                ):(
                    <div style={{display:'block', postion:'relative'}} className='sec2q'>
                        <h3 style={{marginLeft:'30px', fontWeight:'450'}} >Notifications</h3>
                        <PagNotsList Ttems={items}/>
                    </div>
                )
            }
        </>
    );
}

function PagNotsList({Ttems}) {
    const {userName, userId, userEmail, isuserBlocked, userRole, userRep, token} = useGlobalContext()
    const itemsPerPage = 20
    const [items, setItems] = useState(Ttems)
    const [prevtag, setPrevtag] = useState(0)

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    
    // console.log(items, Ttems)
    useEffect(() => {
        setItems(Ttems)
    },[Ttems])

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
            setCurrentItems(items?.slice(nwofst, nwofst + itemsPerPage))
        }
    }, [itemOffset, itemsPerPage, items, initialpage, prevtag]);

    function updp(event){
        return new Promise(async (resolve, reject) => {
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

    const [opensnack, setOpensnack] = useState(false);
    const [snackmsg, setSnackmsg] = useState('')
    
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


    return (
        <>
            <Snackbar
                open={opensnack}
                autoHideDuration={6000}
                onClose={handleSnackclose}
                message={snackmsg}
                action={snackaction}
            />
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
                currentItems?.map((qs, index) => {
                    // console.log(qs)
                    return (
                        <>
                            <div style={{ postion:'relative', display:'flex',minHeight:'50px', boxShadow: '0 1px 2px rgba(0,0,0,0.15),0 0px 2px rgba(0,0,0,0.1)'}} className='qlist'>
                                <div style={{paddingTop:'10px',paddingBottom:'10px'}} className='qitem'>
                                    {
                                        (qs.ntype === 'ATOQ')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} to={`/questions/${qs.natoq.q_id}?aid=${qs.natoq.a_id}`} className='qitemL'>
                                                    A new answer was posted for one of your questions. Click here to view the answer.
                                                </Link>
                                            </>
                                        ):
                                        (qs.ntype === 'USRTOMOD')?(
                                            <>You are now a moderator. Congrats !!!</>
                                        ):
                                        (qs.ntype === 'MODTOUSR')?(
                                            <>You are no longar a moderator.</>
                                        ):
                                        (qs.ntype === 'BOUNTYRECVED')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} to={`/questions/${qs.natoq.q_id}?aid=${qs.natoq.a_id}`} className='qitemL'>
                                                    Your answer received +{qs.natoq.bountyval} reputation point as bounty. Click here to view your answer.
                                                </Link>
                                            </>
                                        ):
                                        (qs.ntype === 'ANSACCEPTED')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} to={`/questions/${qs.natoq.q_id}?aid=${qs.natoq.a_id}`} className='qitemL'>
                                                    One of your answer was accepted by the questioner. Click here to view your answer.
                                                </Link>
                                            </>
                                        ):
                                        (qs.ntype === 'QEDTSUGSTED')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.natoq.q_id}`} className='qitemL'>
                                                    Someone suggested an edit to one of your question. Click here to view the edit suggestion.
                                                </Link>
                                            </>
                                        ):
                                        (qs.ntype === 'QEDTSUGACCEPTED')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.natoq.q_id}`} className='qitemL'>
                                                    Your edit suggestion to a question was accepted by questioner. Click here to view the edited question.
                                                </Link>
                                            </>
                                        ):
                                        (qs.ntype === 'DELQ')?(
                                            <>
                                                One of your question was deleted by {(qs.nByAdmin)?'Admin':'a Moderator'}.
                                            </>
                                        ):
                                        (qs.ntype === 'DELA')?(
                                            <>
                                                <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.natoq.q_id}`} className='qitemL'>
                                                    One of your answer to a question was deleted by {(qs.nByAdmin)?'Admin':'a Moderator'}. Click here to view the question.
                                                </Link>
                                            </>
                                        ):
                                        (<></>)
                                    }
                                </div>
                            </div>
                        </>
                    );  
                })
            }
        </>
    );
}

export default Notifications;