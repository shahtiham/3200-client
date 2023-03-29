import React, {useState, useContext, useEffect} from "react"
import Axios from 'axios'
import io from "socket.io-client";

const AppContext = React.createContext()

const socket = io.connect("http://localhost:8089");

const AppProvider = ({children}) => {
    // commenting out this line to check cors error
    // Axios.defaults.withCredentials = true

    // check login stuff,{user:{"user_id":`${userId}`}}
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVhQGdtYWlsLmNvbSIsImlhdCI6MTY1Njg1NjQ3NCwiZXhwIjoxNjU2OTQyODc0fQ.c3ck7VHtgFVtwHDhPFWb3FluElMuUpobW9Prgz4enco"
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [userName, setUserName] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userEmail, setEmail] = useState(null)
    const [isuserBlocked, setIsuserblocked] = useState(null)
    const [userCreated, setUsercreated] = useState(null)
    const [userRole, setUserrole] = useState(null)
    const [userRep, setUserrep] = useState(null)

    const [headerrendered, setHeaderrendered] = useState(false)
    const resetheaderren = (val) => {
        setHeaderrendered(val)
    }

    const [tagsfromdb, setTagsfromdb] = useState([])

    const [tag, setTag] = useState(['all'])
    const [prevtag, setPrevtag] = useState(0)

    const [askingT, setAskingT] = useState('')
    const [askingB, setAskingB] = useState('')
    //console.log(userName, askingT)
    const resetAskingB = (val) => {
        setAskingB(val)
    }
    const resetAskingT = (val) => {
        setAskingT(val)
    }
    const resetPrevtag = (val) => {
        setPrevtag(val)
    }
    const resetTag = (val) => {
        setTag(val)
    }

    const ckifloggedin = (v) => {
        /* https://tiham.herokuapp.com/ */
        Axios.get("http://localhost:8089/isloggedin", {headers:{"authorization": `${token}`}})
        .then((res) => {
            //console.log(res,userEmail,res.data.email)
            setEmail(res.data.email)
            setUserId(res.data.user_id)
            Axios.get("http://localhost:8089/userinfo", {headers:{"authorization": `${token}`}})
            .then((result) => {
                //console.log(result)
                setUsercreated(result.data.created)
                setIsuserblocked(result.data.blocked)
                setUserrole(result.data.role)
                setUserrep(result.data.rep)
                setUserName(result.data.username)
            })
        })
        .catch((err) => {
            //console.log(err)
            localStorage.setItem('token', null)
            setToken(null)
            setUserId(null)
            setUserName(null)
            setEmail(null)
            setUsercreated(null)
            setIsuserblocked(null)
            setUserrole(null)
            setUserrep(null)
        })
    }

    const gettagsfromdb = (v) => {
        Axios.get("http://localhost:8089/tags").then((res) => {
            const arr = []
            res.data.forEach(element => {
                arr.push({
                    value:element.tag,
                    label:element.tag
                })
            });
            setTagsfromdb(arr)
        })
    }

    useEffect(() => {
        ckifloggedin(0)
    },[token])

    const resetToken = (tkn) => {
        setToken(tkn)
    }

    const resetUserName = (val) => {
        setUserName(val)
    }

    const resetUserId = (val) => {
        setUserId(val)
    }

    const resetEmail = (val) => {
        setEmail(val)
    }
    
    const logUserIn = () => {
        setIsUserLoggedIn = true
    }

    const logUserOut = () => {
        setIsUserLoggedIn = false
    }
    
    return <AppContext.Provider value={{
        socket,
        isUserLoggedIn,
        token,
        userName,
        userId,
        userEmail,
        isuserBlocked,
        tag,
        prevtag,
        askingT,
        askingB,
        tagsfromdb,
        userCreated,
        userRole,
        userRep,
        headerrendered,
        resetheaderren,
        resetAskingB,
        resetAskingT,
        resetTag,
        resetPrevtag,
        resetToken,
        resetUserName,
        resetUserId,
        resetEmail,
        logUserIn,
        logUserOut,
        ckifloggedin,
        gettagsfromdb,
    }}>
        {children}
    </AppContext.Provider>
}

// CUSTOM HOOK
export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider}