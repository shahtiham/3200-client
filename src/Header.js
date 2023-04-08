import { Link, Navigate } from 'react-router-dom';

import {useState, useEffect, useRef} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import {useGlobalContext} from './Context'

import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Loginbtn({innertxt, route, st}) {
    const navigate = useNavigate()
    const loc = useLocation()
    
    return (
        <button className={`slbtn ${st}`} onClick={() => {
            window.scrollTo({top:0,behavior:'smooth'})
            navigate(route, {state:{pathname:loc?.pathname}})
            //navigate('/questions/1?aid=3')
            //<Navigate to='/login' replace={true}/> // This one doesn't work
        }}>
            {innertxt}
        </button>
    );
}

function Logoutbtn() {
    const {resetToken, resetUserName, resetEmail, resetUserId} = useGlobalContext()
    return (
        <button className='slbtn loginbtn' onClick={() => {
            localStorage.setItem("token", null)
            localStorage.setItem("email", null)
            resetToken(null)
            resetUserName(null)
            resetUserId(null)
            resetEmail(null)
        }}>
            Log out
        </button>
    );
}

function Userbtn() {
    const { userId, userName } = useGlobalContext()
    console.log('user', userId)
    const navigate = useNavigate()
    return (
        <button className='slbtn userbtn' onClick={() => {
            navigate(`/user/${userId}`, {state:{userName:userName}})
        }}>
            Profile
        </button>
    );
}

function Nbadge() {
    const { userId, userName, userEmail, socket, nn } = useGlobalContext()
    // const nn = useRef(0)
    console.log('Nbadge rend', nn.current)
    // useEffect(()=>{
    //     socket.on('not', (data) => {
    //         nn.current += 1
    //         console.log('ping')
    //     })
    // }, [socket])
    return(
        <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/notifications' className='questionlink' style={{right:'500px'}}>
            <Badge color="secondary" badgeContent={nn}>
                <NotificationsIcon />
            </Badge>
        </Link>
    );
}

function Header(props) {
    
    const [user, setuser] = useState(null)
    const {token, headerrendered, resetheaderren, ckifloggedin} = useGlobalContext()
    // console.log('header', headerrendered) // This trick works.
    if(headerrendered === false){
        resetheaderren(true)
        // setInterval(() => {
        //     //ckifloggedin(0)
        // }, 1000);
    }
    //console.log("Header rendered", token)
    return (
        <header className="Appheader">
            {/* Ham Menu */}
            {/* <div className="ham">
                <div className='rec rec1'></div>
                <div className='rec rec2'></div>
                <div className='rec rec3'></div>
            </div> */}

            {/* <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/' className='homelink'>Home</Link> */}
            <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/questions' className='questionlink'>Questions</Link>
            <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/users' className='questionlink' style={{right:'420px'}}>Users</Link>
            {token?(
                <>
                    <Userbtn />
                    <Logoutbtn />
                    <Nbadge />
                </>
                ):(
                    <>
                        <Loginbtn innertxt='Signup' route='/signup' st='signupbtn' />
                        <Loginbtn innertxt='Login' route='/login' st='loginbtn' />
                    </>
                )
            }
        </header>
    );
}

export default Header;