import { useState, useEffect, useRef, Fragment } from "react";
import './bodySection.css';
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import copy from './copy.png'
import remove from './remove.png'
import {useGlobalContext} from './Context'

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Axios from 'axios'

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

function PagQsList(props) {
    // prevtag => last (most recent) selected page... It resets when specific page number is clicked..
    // If prevtag is greater than page count of 'items', first page is displayed and prevtag is not changed..
    const {prevtag, resetPrevtag, userRep, userRole, token} = useGlobalContext()
    const {items, resetRer} = props

    const delqid = useRef(null)
    const [openmodal, setOpenmodal] = useState(false);
    const handleOpenmodal = () => {setOpenmodal(true);}
    const handleClosemodal = () => {delqid.current = null; setOpenmodal(false);}

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    
    const itemsPerPage = 10

//    console.log("pag rend", pageCount, itemOffset, "initpage: ", initialpage, items)

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

    function updp(event){
        return new Promise(async (resolve, reject) => {
            resetPrevtag(event.selected)
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
        // console.log(key,document.getElementById('linkcpyNotify').classList)
        console.log(lnk)
        navigator.clipboard.writeText(lnk).then(()=>{
            if(!document.getElementById('linkcpyNotify').classList.contains('show')){
                document.getElementById('linkcpyNotify').classList.add('show')
                  setTimeout(() => {
                      document.getElementById('linkcpyNotify').classList.remove('show')
                }, 2000);
            }
        })
    }

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
    const handleqdel = (qs) => {
        // console.log(qs)
        delqid.current = qs.q_id
        setOpenmodal(true)
    }
    const delqes = () => {
        console.log(delqid.current)
        if(userRole === 'USER'){
            handleSnackopen('You can not delete a question')
            return
        }
        Axios.post('http://localhost:8089/deletequestion', {
            q_id: delqid.current
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            resetRer()
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })

        delqid.current=null
    }

    return (
        <>
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
                        Are you sure you want to delete this question?                     
                        <Button style={{position:'absolute', top:'55%', left:'20%'}} color='success' variant="contained" size="small" onClick={(e)=> {
                            setOpenmodal(false)
                            delqes()
                        }}>
                            YES
                        </Button>
                        <Button style={{position:'absolute', top:'55%', left:'70%'}} color='error' variant="contained" size="small" onClick={(e)=> handleClosemodal()}>
                            NO
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <div id='linkcpyNotify' className='notify'>Link copied to clipboard</div>
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
                    let d = new Date(qs.created)
                    //console.log("d : ", d)
                    return(
                        <div style={{position:'relative', display:'flex', flexDirection:'column'}} className='qlist' key={index}>
                            <div id={index} style={{overflowY: 'visible'}} className='ansidcont'>
                                <img style={{zIndex:'1'}} onClick={(e)=>{hndlcpy(`http://localhost:3000/questions/${qs.q_id}`)}} 
                                src={copy} title='Copy link'/>
                            </div>
                            
                            <div style={{position:'relative'}} className='qitem'>
                                <Link onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.q_id}`} state={{qs:qs, isf:false}} className='qitemL'>{qs.title}</Link>
                                {
                                    userRole === 'ADMIN' || userRole === 'MODERATOR'?(
                                        <div style={{position:'absolute', display:'flex', bottom:'2px',right:'4px' , width: '20px', height:'20px'}}>
                                            <img style={{cursor:'pointer'}} src={remove} title='Delete question'
                                            onClick={(e) => handleqdel(qs)} />
                                        </div>
                                    ):(<></>)
                                }
                            </div>
                            {/* This tag part is for prisma */}
                            <div className='vitem' style={{marginLeft:'20px', borderLeft:'0px', borderRight:'0px', width:'auto'}}>
                                {
                                    qs.tag?.map((tg) => {
                                        return(
                                            <div className="multitagcont">
                                                <a href='#' style={{pointerEvents:'none', backgroundColor:'hsl(205,46%,92%)', textDecoration:'none', 
                                                    color:'hsl(205,47%,42%)', paddingLeft:'6px', paddingRight:'6px', paddingBottom:'2px', borderRadius:'4px',fontSize:'12px'}}
                                                >{tg.tag}</a>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className='vitem' style={{borderLeft:'0px', borderRight:'0px'}}>
                                <div className='vts'>
                                    {(qs.votes === null)? (<>0 Votes</>):(<>{qs.votes} Votes</>)}
                                </div>
                                {/* {<div className='titem'><div className="tagnamecont">{qs.tag} </div></div>} */}
                            </div>
                            <div className='whitem'>
                                <>
                                    <Link style={{textDecoration:'none',color:'black'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${qs.u_id}`}>
                                        {qs.username} 
                                    </Link>
                                    &nbsp;asked on {d.toString().split('GMT')[0]}
                                </>
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
}

export default PagQsList;