import LoginPage from "./loginPage"
import { useState, useEffect } from "react"
import { Navigate} from "react-router-dom"
import urls from "./variables/urls"

export default function Login()  {
    const [lgin, setLgin] = useState(false)
    const [loading, setLoading] = useState(true)
useEffect(() => {
  
const isLoggedIn = () => {
   

    const validation = async() => {
        const token = window.localStorage.getItem("token")
        if(!token) {
            setLoading(false)
            setLgin(false)

        }

        if(token) {
           const dt = await fetch(urls.backend+"/api/auth/getuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
    
 
        })

        const data  = await dt.json()
        if(data) {
            setLgin(data.success)
            setLoading(false)
        }
    }
}
validation()

return [lgin, loading]
}
isLoggedIn()
}, []) 

   
   if(loading === false && lgin === true) {
    return <Navigate to="/"/>
} else  if(loading === false  && lgin === false){
    return <LoginPage/>
}  else  {
    return <></>
} 

   
  
}