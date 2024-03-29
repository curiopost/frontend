import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./img.css"
import "./body.css"
import "./darkmode.css"
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
import ViewFollowers from "./ViewFollowers";
import ViewFollowing from "./ViewFollowing";
import ResetPassword from "./resetPassword";
import "./LoadingPage.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
        try {
            let theme = window.localStorage.getItem("theme");
            if(!theme) theme = "light"
            if(theme === "dark") {
                document.body.classList.toggle("bg-dark")
                document.body.classList.toggle("text-light")
                
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

            if(theme === "dark") {
                document.body.classList.remove("bg-dark")
                document.body.classList.remove("text-light")
                
            }
            setIslgin(false)
            setUdata(data)
            setLoading(false)
            return;

        }
    } catch(e) {

        toast.error(`Could not contact the backend, please reload!`)
    }

    }

    getUserData()
   }, [])

   if(loading === true) return (
    <>
      <ToastContainer/>
    <div className="App">
      
          <header className="App-header">
            <img src={process.env.PUBLIC_URL+"/logo.png"} height={125} width={125}></img>
    
            
          </header>
 
        
    </div>
    </>
   )

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
    <Route path="/u/:username/followers" element={<ViewFollowers islgin={islgin} data={udata}/>}/>
    <Route path="/u/:username/following" element={<ViewFollowing islgin={islgin} data={udata}/>}/>
    <Route path="/reset_password" element={islgin ? <Navigate to="/"/> : <ResetPassword/>}></Route>
    <Route path="*" element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
)


}

export default App



