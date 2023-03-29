import './bodySection.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import React, { Fragment, useEffect, useState, useRef, useContext } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';
import {useGlobalContext} from './Context'
import { useQpgContext } from './Singleqs';

import MarkDown from './MarkDown';


function PagSgtedtList({itms}) {
    const {token,ckifloggedin} = useGlobalContext()
    const {loadq, resetLoadq} = useQpgContext()
    const itemsPerPage = 2
    const [items, setItems] = useState(itms)
    const [prevtag, setPrevtag] = useState(0)
    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    

    console.log("pag rend", loadq, itms, items)

    useEffect(() => {
        setItems(itms)
    },[itms])

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
    }, [itemOffset, itemsPerPage, items, initialpage, prevtag]);

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

    const handleAcceptsgt = (tq) => {
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/questions/acceptedtsgt", {
            tq:tq
        } , { headers:{"authorization": `${token}`}
        }).then((res) => {
            console.log(res)
            resetLoadq(loadq === true?false:true)
            setOpenlnrprogbar(false)
            handleSnackopen(res.data)
        }).catch((err) => {
            console.log(err)
            setOpenlnrprogbar(false)
            if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                handleSnackopen('Please login before Editing a question')
                ckifloggedin(0)
            } else {
                handleSnackopen(err.response.data)
            }
        })
    }
    const handleDiscardsgt = (tq) => {
        setOpenlnrprogbar(true)
        Axios.post("http://localhost:8089/questions/discardedtsgt", {
            tq:tq
        } , { headers:{"authorization": `${token}`}
        }).then((res) => {
            console.log(res)
            resetLoadq(loadq === true?false:true)
            setOpenlnrprogbar(false)
            handleSnackopen(res.data)
        }).catch((err) => {
            console.log(err)
            setOpenlnrprogbar(false)
            if(err.response.data === 'Invalid Token' || err.response.data === "A token is required for authentication"){
                handleSnackopen('Please login')
                ckifloggedin(0)
            } else {
                handleSnackopen(err.response.data)
            }
        })
    }

    
    return(
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
                currentItems !== null && currentItems.length !== 0?(
                    <>
                        {
                            currentItems?.map((tq) => {
                                return(
                                    <div key={tq.id}>
                                        <div className='qlist'>
                                            <div className='qitem' style={{position:'relative'}}>
                                                {/* The question */}
                                                <h2 className='singleqshead'>{tq.title}</h2>
                                            </div>
                                        </div>
                                        {/* here should be question description : begin*/}
                                        
                                        <div style={{position:'relative'}} className="revcont">
                                            {/* This one WORKS */}
                                            {/* *** MAKE THIS SEPARATE COMPONENT and use here, answer list, post answer and in Ask page */}
                                            <MarkDown text={tq.question} />

                                            {/* Edit question... */}
                                            {/* <img className='editic' onClick={(e)=>{
                                                window.scrollTo({top:0,behavior:'smooth'})
                                                navigate('/ask', {state:tq})
                                            }} 
                                            src={edit} title='Edit'/> */}
                                        </div>
                                        {/* here should be question description : end*/}

                                        {/* user and info.. begin */}
                                        <div className='sqdvcont'>
                                            {
                                                tq.tag?.map((tg) => {
                                                    return(
                                                        <div className="multitagcont">{tg.tag}</div>
                                                    );
                                                })
                                            }
                                            <div className='sqab'>
                                                <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${tq.u_id}`}>
                                                    {tq.sugBy.username}
                                                </Link>
                                                &nbsp;suggested on {(new Date(tq.created)).toString().split('GMT')[0]}
                                            </div>
                                        </div>
                                        <div className='sqdvcont' style={{padding:'10px'}}>
                                            <Stack direction="row" spacing={2}>
                                                <Button variant="contained" color="success" size='small' onClick={(e) => {handleAcceptsgt(tq)}}>
                                                    Accept
                                                </Button>
                                                <Button variant="outlined" color="error" size='small' onClick={(e) => {handleDiscardsgt(tq)}}>
                                                    Discard
                                                </Button>
                                            </Stack>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </>
                ):(<h4 style={{position:'relative',marginLeft:'40px', fontWeight:'400'}}>No Suggestion Available</h4>)
            }
            
        </>
    );
}



export default PagSgtedtList;