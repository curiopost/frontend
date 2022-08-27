import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import urls from "./variables/urls"
import About from "./about"
import Feeds from "./loggedInHomePage"
import Login from "./loginPage"
import Logout from "./logout";
import Register from "./registerPage"
import Verify from "./verify"
import Search from "./search"
import Topics from "./topics"
import Notifications from "./notifications";
import Account from "./account";
import Profile from "./profilePage"
import ViewPost from "./viewPost"
import Manage from "./manage"
import Terms from "./terms"
import Privacy from "./privacy"
import NotFound from "./NotFound";



function App() {

    const [islgin, setIslgin] = useState(false)
   const [loading, setLoading] = useState(true)
   const [udata, setUdata] = useState({})

   useEffect(() => { 
    const getUserData = async() => {

        const token = window.localStorage.getItem("token")
        if(!token) {
            setIslgin(false)
            setUdata({})
            setLoading(false)
            return;
        }

        const getUserData = await fetch(urls.backend+"/api/auth/getuser", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        const data = await getUserData.json()
        if(data.success) {
            setIslgin(true)
            setUdata(data)
            setLoading(false)
            return;
        } else {
            setIslgin(false)
            setUdata(data)
            setLoading(false)
            return;

        }

    }

    getUserData()
   }, [])

   if(loading === true) return <></>

return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={islgin ? <Feeds data={udata}/> : <About/>} />
    <Route path="/login" element={islgin ? <Navigate to="/"/> : <Login/>}/>
    <Route path="/logout" element={<Logout /> }/>
    <Route path="/register" element={islgin ? <Navigate to="/"/> : <Register/>}/>
    <Route path="/verify" element={<Verify/>}/>
    <Route path="/search" element={<Search islgin={islgin} data={udata}/>}/>
    <Route path="/topics/:topic" element={islgin ? <Topics data={udata}/> : <Navigate to="/login"/>}/>
    <Route path="/notifications" element={islgin ? <Notifications data={udata}/> : <Navigate to="/login"/>}/>
    <Route path="/account" element={islgin ? <Account data={udata}/> : <Navigate to="/login"/>}/>
    <Route path="/u/:username" element={<Profile islgin={islgin} data={udata}/>}/>
    <Route path="/:type/:id" element={<ViewPost islgin={islgin} data={udata}/>}/>
    <Route path="/:type/:id/manage" element={islgin ? <Manage data={udata}/> : <Navigate to="/login"/>}/>
    <Route path="/terms" element={<Terms islgin={islgin} data={udata}/>}/>
    <Route path="/privacy" element={<Privacy islgin={islgin} data={udata}/>}/>
    <Route path="*" element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
)


}

export default App



