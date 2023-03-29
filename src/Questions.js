import './bodySection.css';

import Icon from '@mui/material/Icon';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import PagQsList from './PagQsList';
import { Link } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';

import {useEffect, useState, Fragment} from 'react'
import {useGlobalContext} from './Context'
import Axios from 'axios'

import { options } from './Options';
import { optionsOdv } from './OptionsOdv';
import Select from 'react-select'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid rgba(25, 118, 210, 0.5)',
    borderRadius:'4px',
    boxShadow: 24,
    p: 4,
};
function Questions() {
    const {tag, resetTag, askingB, resetAskingB, tagsfromdb, gettagsfromdb, userRep, userRole, token, ckifloggedin} = useGlobalContext()
    const [qtns, setQtns] = useState([])
    const [src, setSrc] = useState('')
    const [odrby, setOdrby] = useState('date')
    const [formats, setFormats] = useState(() => []);
    
    const [rer, setRer] = useState(0)
    const resetRer = () =>{
        setRer(rer === 0?1:0)
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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [valuefrommodal, setValuefrommodal] = useState(null);

    const handleChangemodal = (value) => {
        setValuefrommodal(value);
    }
    //requesting to create/add new tag
    const handlerqtg = () => {
        if(valuefrommodal === null || valuefrommodal === ""){
            alert("Please set tag")
        } else if(valuefrommodal.length >= 32){
            alert("Number of characters must be less than 32")
        } else {
            setOpen(false)
            setOpenlnrprogbar(true)
            Axios.post("http://localhost:8089/reqcreatetag", {
                reqtag:valuefrommodal
            }, { headers:{"authorization": `${token}`}}).then((res) => {
                //console.log(res)
                setOpenlnrprogbar(false)
                handleSnackopen(res.data)
                gettagsfromdb(0)
                setValuefrommodal('')
            })
            .catch((err) => {
                setOpenlnrprogbar(false)
                console.log(err)
                if(err.response.data === 'Invalid Token'){
                    handleSnackopen('Please login before requesting a tag')
                    ckifloggedin(0)
                } else {
                    handleSnackopen(err.response.data)
                }
            })
        }
    }

    const handleFormat = (event, newFormats) => {
        console.log(formats)
        setFormats(newFormats);
      };

    const fnf = []
    tagsfromdb.forEach((e)=>{
        if(tag.includes(e.label)){
            fnf.push({
                value:e.value,
                label:e.label
            })
        }
    })
    //console.log(fnf, tagsfromdb)
    function handlesettingqtns (res){
        return new Promise((resolve, reject) => {
            setQtns(res)
            resolve()
        })
    }

    function fltr(res){
        console.log(askingB.split(' '),res.data)
        let s =askingB.split(' ')
        let a = new Set([])
        for(let i = 0; i < res.data.length; i++){
            let p = res.data[i].title.toLowerCase()
            for(let j = 0; j < s.length; j++) if(s[j] !== ''){
                if(p.includes(s[j])){
                    a.add(i)
                    break
                }
            }
            /* p = res.data[i].question.toLowerCase()
            for(let j = 0; j < s.length; j++) if(s[j] !== ''){
                if(p.includes(s[j])){
                    a.add(i)
                    break
                }
            } */
        }
        let dt = []
        a.forEach((ai) => dt.push(res.data[ai]))
        return dt
    }

    function getstag() {
        return new Promise((resolve, reject) => {
            let stag = '?'
            console.log('t ren')
            if(tag.length !== 0 && tag.includes('all') === false){
                // stag+='?'
                tag.forEach((e,index)=>{
                    stag = stag + "tag=" + e
                    if(index + 1 !== tag.length)
                        stag += "&"
                })
                console.log(stag)
            }
            let bountied = ''
            if(formats.length !== 0 && formats.includes('b')){
                bountied +="&bountied=b"
            }
            let un = ''
            if(formats.length !== 0 && formats.includes('u')){
                un += "&un=u"
            }
            Axios.get("http://localhost:8089/questions/tagged/" + "-1/" + odrby + stag + bountied + un).then(async (res) => {
                //console.log(res.data[13].question.toLowerCase())
                try{
                    console.log(res)
                    let dt = (askingB === '')?res.data: fltr(res)
                    const wait = await handlesettingqtns(dt)
                    resolve()
                }catch{
                    console.log('error')
                    reject()
                }
            })
        })
    }

    useEffect(() => {
        async function fetchdata() {
            const wait = await getstag()
        }
        fetchdata()
    }, [tag, odrby, formats, rer])
    const handlesrch = async (e) => {
        const wait = await getstag()
    }

    //getting tags from db
    useEffect(() => {
        gettagsfromdb(0)
    }, [])

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
            <div className='sec2q'>
                {/* ASK QUESTION PAGE LINK */}
                <Link to='/ask' className='asklink'>
                    Ask Question
                </Link>

                <div className="wrap">
                    <div className="search">
                        <input  value={askingB} type="text" className="searchTerm" placeholder="Search..." onChange={(e) => resetAskingB(e.target.value)}/>
                        <button type="submit" className="searchButton" onClick={(e)=>{handlesrch(e)}}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                <div className='sortsec'>
                    <div style={{marginLeft:'10px', position:'relative',top:'15px'}}> Order BY </div>
                    <div style={{marginLeft:'10px', position:'relative',marginTop:'10px', width:'200px'}}>
                        <Select isMulti={false} options={optionsOdv} defaultValue={optionsOdv.find((e)=> e.label === odrby)} onChange={(e)=>{
                            setOdrby(e.label)
                        }}/>
                    </div>
                    <div className='sortsecselectcont'>
                        <Select isMulti={true} options={tagsfromdb} defaultValue={fnf/* options.find((e)=> e.label === tag) */} onChange={(e)=>{
                            let chtag = []
                            e.forEach((e)=>chtag.push(e.label))
                            resetTag(chtag)
                            console.log(chtag)//
                        }}/>
                        {
                            (1 == 1)?(
                                <>
                                    <IconButton style={{float:'right'}} aria-label="delete" onClick={handleOpen}>
                                        <Icon>add_circle</Icon>
                                    </IconButton>
                                </>
                            ):(
                                <></>
                            )
                        }

                        <ToggleButtonGroup
                            style={{height:'35px', display:'flex', position:'relative', right:'0px'}}
                            value={formats}
                            onChange={handleFormat}
                            aria-label="text formatting"
                            >
                            <ToggleButton value="b" aria-label="bold">
                                Bountied
                            </ToggleButton>
                            <ToggleButton value="u" aria-label="italic">
                                Unanswered
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                    </div>
                </div>
                
                <PagQsList items={qtns} resetRer={resetRer}/>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Tag Name"
                            multiline
                            maxRows={4}
                            value={valuefrommodal}
                            onChange={(e)=>handleChangemodal(e.target.value)}
                        />
                        <Button style={{right:'10px',position:'absolute', top:'35%'}} variant="outlined" onClick={handlerqtg}>
                            {
                                (userRole === "MODERATOR" || userRole === "ADMIN")?"Add Tag":(userRole === "USER")?"Request Tag":"Null"
                            }
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default Questions;