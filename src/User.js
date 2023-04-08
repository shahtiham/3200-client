import './bodySection.css'

import { Link, useParams } from 'react-router-dom'

import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios'
import ReactPaginate from 'react-paginate';

import Select from 'react-select'
import { optionsUqa } from './OptionsUqa';
import { optionsUOdv } from './OptionsUOdv';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import {useGlobalContext} from './Context'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function User() {
    const {userName, userEmail, isuserBlocked, userRole, userRep, token, ckifloggedin} = useGlobalContext()
    //Axios.defaults.withCredentials = true
    const { userId } = useParams() // * user id from url parameter
    const [usrName, setUserName] = useState('')
    const [userdi, setUserdi] = useState(undefined)
    const [rer, setRer] = useState(0)
    const resetRer = () => {
        setRer(rer===0?1:0)
    }
    //console.log(userName)

    const [tag, setTag] = useState('questions')
    const [odrby, setOdrby] = useState('date')
    const [items, setItems] = useState([])
    //console.log(items)

    const [ismod, setIsmod] = useState(null);

    const handleIsmod = (event, val) => {
        console.log(val)
        setIsmod(val);
    };
    useEffect(() => {
        ckifloggedin(0)
    },[])

    useEffect(() => {
        if(ismod){
            Axios.get('http://localhost:8089/requestedtaglist', {headers:{"authorization": `${token}`}}).then((res) => {
                console.log(res)
                setItems(res.data)
            })
        }
        else if(tag === 'questions'){
            Axios.get(`http://localhost:8089/questions/${userId}/${odrby}`).then((res) => {
                console.log(res) // * getting all question
                setItems(res.data)
                setUserName(res.data[0].username)
            })
        } else {
            Axios.get(`http://localhost:8089/questions/ans/${userId}/${odrby}`).then((res) => {
                console.log(res) // * getting all answered question
                setItems(res.data)
                setUserName(res.data[0].username)
            })
        }
    },[tag, odrby, userId, ismod, rer])

    useEffect(() => {
        Axios.get(`http://localhost:8089/detaileduinfo/${userId}`).then((res) => {
            console.log(res)
            setUserdi(res.data.u)
        }).catch((err) => {
            console.log(err)
        })
    }, [userId])
    useEffect(() => {
        console.log(userdi)
    }, [userdi])

    return(
        <div style={{display:'block'}} className='sec2q'>
            <h3 style={{marginLeft:'30px', fontWeight:'450'}} >User : {userdi === undefined || userdi === null?"":
                userdi.username? userdi.username:""}</h3>
            <h3 style={{marginLeft:'30px', fontWeight:'450'}} >Reputation : {userdi === undefined || userdi === null?"":
                userdi.rep !== null? userdi.rep:""}</h3>
            <h3 style={{marginLeft:'30px', fontWeight:'450'}} >Role : {userdi === undefined || userdi === null?"":
                userdi.role !== null? userdi.role:""}</h3>
            
            
            <div className='sortsec'>
                <div style={{marginLeft:'10px', position:'relative',top:'15px'}}> Order BY </div>
                <div style={{marginLeft:'10px', position:'relative',marginTop:'10px'}}>
                    <Select isMulti={false} options={optionsUOdv} defaultValue={optionsUOdv.find((e)=> e.label === odrby)} onChange={(e)=>{
                        setOdrby(e.label)
                    }}/>
                </div>
                <div className='sortsecselectcont'>
                    <Select isMulti={false} options={optionsUqa} defaultValue={optionsUqa.find((e)=> e.label === tag)} onChange={(e)=>{
                        setTag(e.label)
                    }}/>
                </div>
                {
                    userRole === 'MODERATOR' || userRole === 'ADMIN'?(
                        <ToggleButtons  ismod={ismod} handleIsmod={handleIsmod} />
                    ):(
                        <></>
                    )
                }
                
            </div>
            <PagUqaList Ttems={items} Ttag={tag} ismod={ismod} userRole={userRole} resetRer={resetRer} token={token}/>
        </div>
    );
}

function ToggleButtons({ismod, handleIsmod}) {
    return (
        <ToggleButtonGroup
            value={ismod}
            exclusive
            color="primary"
            onChange={handleIsmod}
            aria-label="text alignment"
            size='small'
            style={{marginLeft:'20px', marginTop:'5px', marginBottom:'5px'}}
        >
            <ToggleButton value={true} aria-label="left aligned">
                Requested Tags
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

function PagUqaList({Ttems, Ttag, ismod, userRole, resetRer, token}) {
    const itemsPerPage = 20
    const tag = Ttag
    const [items, setItems] = useState([])
    const [prevtag, setPrevtag] = useState(0)

    const [initialpage, setInitialpage] = useState(0)
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    
    //console.log(items, tag, Ttems)
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

    const handleaddtag = async (qs) => {
        console.log(qs)
        if(userRole === 'USER'){
            handleSnackopen('You can not add a tag')
            return
        }
        Axios.post('http://localhost:8089/addordiscardtagreq', {
            reqtag_id: qs.reqtag_id,
            add:true
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            resetRer()
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
    }
    const handledistag = async (qs) => {
        console.log(qs)
        if(userRole === 'USER'){
            handleSnackopen('You can not discard a tag request')
            return
        }
        Axios.post('http://localhost:8089/addordiscardtagreq', {
            reqtag_id: qs.reqtag_id,
            add:false
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            resetRer()
        }).catch((err) => {
            handleSnackopen(err.response.data)
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
                    return (
                        <div style={{position:'relative',minHeight:'50px'}} className='qlist' key={index}>
                            <div style={{paddingTop:'10px',paddingBottom:'10px'}} className='qitem'>
                                {
                                    (ismod)?(
                                        <>
                                            {qs.reqtag}
                                            <Button style={{position:'absolute', height:'25px', left:'60%', top:'25%'}} variant="contained" color="success" size='small'
                                            onClick={(e) => handleaddtag(qs)} >
                                                Add
                                            </Button>
                                            <Button style={{position:'absolute', height:'25px', left:'80%', top:'25%'}} variant="contained" color="error" size='small'
                                            onClick={(e) => handledistag(qs)} >
                                                Discard
                                            </Button>
                                        </>
                                    ):((tag === 'questions') ? (
                                        <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/questions/${qs.q_id}`} className='qitemL'>{qs.title}</Link>
                                    ):(
                                        <Link style={{fontSize:'15px'}} to={`/questions/${qs.q_id}?aid=${qs.a_id}`} className='qitemL'>{qs.title}</Link>
                                    ))
                                }
                                
                            </div>
                        </div>
                    );  
                })
            }
        </>
    );
}

export default User;