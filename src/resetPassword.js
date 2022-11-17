import React from "react";
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./home.css"
import urls from './variables/urls'
import RECAPTCHA from "react-google-recaptcha"
import { useEffect } from "react";
import { useState } from "react";

export default function ResetPassword() {
    document.title = `Reset Password / Curiopost`
    const [formPage, setFormPage] = React.useState(0)
    const captchaRef = React.useRef(null)
    const [replyToken, setReplyToken] = useState('')
    const [passwordToken, setPasswordToken] = useState('')
    const buffer = (element, text) => {

        element.disabled = true 
        element.innerText = text || "Loading..."


    }
    const unbuffer = (element, text) => {

        element.disabled = false
        element.innerText = text 


    }
    const onRequest = async(e) => {
        e.preventDefault()
        buffer(document.getElementById('req-btn'), "Loading...")
        const captcha_token = captchaRef.current.getValue();
        if(!captcha_token) {
            unbuffer(document.getElementById('req-btn'), "Next")
  return document.getElementById('bot-fail').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg> confirm that your not a robot`

        }
const email = document.getElementById('email-req').value
        const submrr = await fetch(urls.backend+`/api/auth/request_recovery?r_key=${captcha_token}`,{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })

        const resp = await submrr.json()
            if(!resp.success){
                captchaRef.current.reset();
                unbuffer(document.getElementById('req-btn'), "Next")
               return toast.error(resp.message)

            }

setReplyToken(resp.reply_token)
setFormPage(1)       
    }
    const [form, setForm] = React.useState([<><p className="text-muted">Reset Your Password</p>
    
        <form onSubmit={onRequest}>
            <div className="input-group mb-4 p-1">

                <span className="input-group-text" id="b1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                </svg></span>
                <input type="email" className="form-control" placeholder="Your Email" aria-label="Email" aria-describedby="b1" id="email-req" required />


            </div>
            <RECAPTCHA
                sitekey={"6LcYoQojAAAAADYeEE1m7AQFQAgix5lP-g5rPehU"}
                ref={captchaRef}
                render="explicit"
                required
            />
            <p className="text-danger" id="bot-fail" style={{ "marginBottom": "0%" }}></p>
            
            <button  className="btn btn-success w-100" style={{"marginBottom": "2%", marginTop: "2%"}}id="req-btn">Next</button>
            <p  className="text-center text-muted " ><Link to="/login" className="text-success text-decoration-none">Go back to login?</Link></p>
        </form></>])

        const onOTPSubmit = async() => {
            const otp = +document.getElementById('otp').value;
            buffer(document.getElementById('otp-btn'), "Loading...")
            const subotp = await fetch(urls.backend+`/api/auth/verify_otp`,{
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    "reply_token": replyToken
                },
                body: JSON.stringify({
                    otp: otp
                })
            })

            const rslts = await subotp.json()
            if(!rslts.success) {
                unbuffer(document.getElementById('otp-btn'), "Next")
                return toast.error(rslts.message)
            }

            const prt = rslts.password_reset_token
            setPasswordToken(prt)
            setFormPage(2)

        }

        const changePasswordF = async() => {
            buffer(document.getElementById('pw-btn'), "Loading...")
            const newpassword = document.getElementById('newpassword').value;
            const cnewpassword = document.getElementById('cnewpassword').value;
            if(newpassword !== cnewpassword) {
                unbuffer(document.getElementById('pw-btn'), "Change Password")
                return toast.error("New Password and Confirm password should match!")
            }
            const reqCp = await fetch(urls.backend+`/api/auth/recover_password`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "reset_password_key": passwordToken
                },
                body: JSON.stringify({
                    newpassword: newpassword
                })
            })
            const gdata = await reqCp.json()
            if(!gdata.success) {
                unbuffer(document.getElementById('pw-btn'), "Change Password")
                toast.error(gdata.message)
            }

            window.localStorage.setItem("token", gdata.token);
            window.location.href = "/"
        }
useEffect(() => {
  if (formPage === 1) {
       setForm([
        <>
        <p className="text-muted">Enter The OTP we sent to your mail</p>
         <div className="input-group mb-4 p-1">

<span className="input-group-text" id="b1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg></span>
<input type="text" className="form-control" placeholder="One Time Password (OTP)" aria-label="otp" aria-describedby="b1" id="otp" required />



</div>
<button className="btn btn-success w-100" style={{"marginBottom": "2%", marginTop: "2%"}} id="otp-btn" onClick={onOTPSubmit}>Next</button>
<p  className="text-center text-muted " ><Link to="/login" className="text-success text-decoration-none">Go back to login?</Link></p>
        </>
       ]) 
    } else if(formPage === 2) {
setForm([
    <>
    <p className="text-muted">Change Your Password</p>
     <div className="input-group mb-4 p-1">

<span className="input-group-text" id="b1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg></span>
<input type="password" autocomplete="new-password" className="form-control" placeholder="New Password" aria-label="password" aria-describedby="b1" id="newpassword" required />



</div>
<div className="input-group mb-4 p-1">

<span className="input-group-text" id="b1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg></span>
<input type="password" className="form-control" placeholder="Confirm New Password" aria-label="password" aria-describedby="b1" id="cnewpassword" required autocomplete="new-password" />



</div>
<button className="btn btn-success w-100" style={{"marginBottom": "2%", marginTop: "2%"}} id="pw-btn" onClick={changePasswordF}>Change Password</button>
<p  className="text-center text-muted " ><Link to="/login" className="text-success text-decoration-none">Go back to login?</Link></p>
    </>
   ]) 
        

    } 

}, [formPage])
        


    return (<>
        <ToastContainer />
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" width="30" height="30" className="d-inline-block align-text-top" /> Curiopost</Link>

                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-controls="#navbarNav" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="nav navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Search</Link>
                        </li>



                    </ul>


                </div>

            </div>
        </nav>
        <div className="container">

            <div className="col-lg-6 offset-lg-3" style={{ "marginTop": "10%", }}>
                {form}
            </div>
        </div>
    </>

    )
}

