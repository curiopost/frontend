import React from "react";
import "./home.css"
import Feeds from "./loggedInHomePage"
import About from "./about"
import urls from "./variables/urls"
import { useState, useEffect} from "react";

export default  function Home() {

  const [response, setResponse] = useState('')

  useEffect(() => {
    
  const getResponse = async() => {
    const token = window.localStorage.getItem("token")


  if(!token) {
   
    const resp = {success: false, message: "Token is expired or invalid.", code: 401}
    setResponse(resp)
  }

  if(token) {
    const f = await fetch(urls.backend+"/api/auth/getuser", {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "token": token
      }
      })
      
      const data  = await f.json()
   

        if(data.success) {
         setResponse(data)
        } else {
         setResponse(data)
        }

      
   
  }
  }

 getResponse()

  }, [])




   

  if(response.success) {
  
    return <Feeds  data={response}/>
  } else {
    return <About />
  }
}

