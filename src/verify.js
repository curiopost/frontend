import urls from "./variables/urls"
import { useEffect } from "react"
import {Link} from "react-router-dom"

export default function Verify() {

    useEffect(()=>{
        const verify = async() => {
            const ur = new URL(window.location.href)
            const token = ur.searchParams.get("token")
          
            
            if(!token) {
                return document.getElementById("verifystat").innerText = `Error: Invalid verification token.`
            }

            const getrsp = await fetch(urls.backend+`/api/auth/verify?token=${token}`, {
                method: "POST"
            })

            const data = await getrsp.json()

            if(!data.success) {
                return document.getElementById("verifystat").innerHTML = "Could not verify your account. Your account is most likely already verified, you can login with your credentials you entered <a href='/login'>here</a>"
            } else {
                window.localStorage.setItem("token", data.token)
                return window.location.href = "/"

            }

            
        }

        verify()

    }, [])

 
    

  return <p id="verifystat" >Loading...</p>

}