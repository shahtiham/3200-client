import './bodySection.css'
import Button from '@mui/material/Button';

import { Link, useParams } from 'react-router-dom'

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

function Users() {
    //Axios.defaults.withCredentials = true
    // const { userId } = useParams() // * user id from url parameter
    // const [userName, setUserName] = useState('')
    const {userName, userId, userEmail, isuserBlocked, userRole, userRep, socket} = useGlobalContext()
    //console.log(userName)

    const [tag, setTag] = useState('questions')
    const [odrby, setOdrby] = useState('date')
    const [rer, setRer] = useState(0)
    const [repordate, setRepordate] = useState('Date')
    const [items, setItems] = useState([])
    //console.log(items)

    const [ismod, setIsmod] = useState(null);

    const handleIsmod = (event, val) => {
        console.log(val)
        setIsmod(val);
    };

    useEffect(() => {
        let mod = ""
        if(ismod === null){
            mod = "?mod=n"
        } else {
            mod = "?mod=y"
        }
        let sort = "&sort=Date"
        if(repordate[0] === 'R'){
            sort = "&sort="+repordate
        }
        Axios.get('http://localhost:8089/userslist' + mod + sort).then((res) => {
            //console.log(res)
            setItems(res.data)
        }).catch((err) => {
            //console.log(err)
        })
    },[ismod, rer, repordate])
    useEffect(() => {
        socket.on("mod_dem_to_usr", (data) => {
            setRer(rer === 0?1:0)
        })
    }, [socket])

    return(
        <div style={{display:'block', postion:'relative'}} className='sec2q'>
            <h3 style={{marginLeft:'30px', fontWeight:'450'}} >User List</h3>
            <div className='sortsec' style={{marginTop:'70px'}}>
                <ToggleButtons  ismod={ismod} handleIsmod={handleIsmod} />
            </div>
            <div style={{width:'250px', marginLeft:'10px', position:'relative',marginTop:'10px'}} >
                <Select isMulti={false} options={optionsRepordate} defaultValue={optionsRepordate.find((e)=> e.label === repordate)} onChange={(e)=>{
                    setRepordate(e.label)
                }}/>
            </div>
            
            <PagUsrsList Ttems={items} Ttag={tag} rer={rer} setRer={setRer}/>
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
                Moderators
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

function PagUsrsList({Ttems, Ttag, rer, setRer}) {
    const {userName, userId, userEmail, isuserBlocked, userRole, userRep, token} = useGlobalContext()
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

    const handleprotomod = async (qs) => {
        console.log(qs)
        if(userRole !== "ADMIN"){
            handleSnackopen('You can not promote a user to moderator')
            return
        }
        if(qs.blocked === true){
            handleSnackopen('This user is restricted')
            return
        }
        if(qs.rep < 100){
            handleSnackopen('This user does not have enough reputation to be a moderator')
            return
        }
        Axios.post('http://localhost:8089/promotetomod', {
            email: qs.email
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setRer(rer === 0?1:0)
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
    }
    const handledetousr = async (qs) => {
        console.log(qs)
        if(userRole !== 'ADMIN'){
            handleSnackopen('You can not demote a moderator to user')
            return
        }
        if(qs.blocked === true){
            handleSnackopen('This user is restricted')
            return
        }
        Axios.post('http://localhost:8089/demotetousr', {
            email: qs.email
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setRer(rer === 0?1:0)
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
    }

    const handlerestrictusr = async (qs) => {
        console.log(qs)
        if(userRole === 'USER'){
            handleSnackopen('You can not restrice a user')
            return
        }
        if(qs.blocked === true){
            handleSnackopen('This user is already restricted')
            return
        }
        if(qs.id === userId){
            handleSnackopen('You can not restrict yourself')
            return
        }
        Axios.post('http://localhost:8089/restrictusr', {
            email: qs.email
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setRer(rer === 0?1:0)
        }).catch((err) => {
            handleSnackopen(err.response.data)
        })
    }
    const handleunrestrictusr = async (qs) => {
        console.log(qs, userRole)
        if(userRole === 'USER'){
            handleSnackopen('You can not unrestrict a user')
            return
        }
        if(qs.blocked === false){
            handleSnackopen('This user is not restricted')
            return
        }
        Axios.post('http://localhost:8089/unrestrictusr', {
            email: qs.email
        } , {
            headers:{"authorization": `${token}`}
        }).then((res) => {
            handleSnackopen(res.data)
            setRer(rer === 0?1:0)
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
                    console.log(qs)
                    return (
                        <>
                            <div style={{postion:'relative', display:'flex',minHeight:'80px', boxShadow: '0 1px 2px rgba(0,0,0,0.15),0 0px 2px rgba(0,0,0,0.1)'}} >
                                <div style={{position:'relative',minHeight:'80px', width:'60%', boxShadow: '0 0 0 0, 0 0 0 0'}} className='qlist' key={index}>
                                    <div style={{paddingTop:'10px',paddingBottom:'10px'}} className='qitem'>
                                        <Link style={{fontSize:'15px'}} onClick={(e) => window.scrollTo({top:0,behavior:"auto"})} to={`/user/${qs.id}`} className='qitemL'>{qs.username}</Link>
                                    </div>
                                    <div style={{paddingTop:'0px',paddingBottom:'10px', fontFamily:'sans-serif', fontSize:'14px'}} className='qitem'>
                                        Reputation : {qs.rep}
                                    </div>
                                    
                                </div>
                                <div style={{display:'flex', marginLeft:'auto', flexDirection:'column', height:'inherit', position:'relative'}} >
                                    {
                                        userRole === 'MODERATOR' || userRole === 'ADMIN'?(
                                        <>
                                            {
                                                qs.role !== 'MODERATOR'?(
                                                    <Button style={{position:'relative', height:'25px', right:'2%', top:'10px'}} variant="contained" color="success" size='small'
                                                    onClick={(e) => {handleprotomod(qs)}} >
                                                        Promote to moderator
                                                    </Button>
                                                ):(
                                                    <Button style={{position:'relative', height:'25px', right:'2%', top:'10px'}} variant="contained" color="error" size='small'
                                                    onClick={(e) => {handledetousr(qs)}} >
                                                        Demote to user
                                                    </Button>
                                                )
                                            }
                                            
                                            {
                                                qs.blocked === false?(
                                                    <Button style={{position:'relative',height:'25px', right:'2%', marginTop:'20px'}} variant="contained" color="error" size='small' 
                                                    onClick={(e) => {handlerestrictusr(qs)}} >
                                                        Restrict user
                                                    </Button>
                                                ):(
                                                    <Button style={{position:'relative',height:'25px', right:'2%', marginTop:'20px'}} variant="contained" color="success" size='small' 
                                                    onClick={(e) => {handleunrestrictusr(qs)}} >
                                                        Unrestrict user
                                                    </Button>
                                                )
                                            }
                                            
                                        </>
                                        ):(
                                            <></>
                                        )
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

export default Users;