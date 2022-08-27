import  { Navigate } from 'react-router-dom'
import { useState, useEffect } from "react";

export default function Logout() {

  useEffect(() => {

    window.localStorage.clear()
    return window.location.href = "/"
  }, [])


        
        

 return <></>
}





