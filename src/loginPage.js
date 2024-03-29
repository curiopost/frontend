import React from "react";
import {Link} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./home.css"
import urls from './variables/urls'
import RECAPTCHA from "react-google-recaptcha"


export default function LoginPage() {
    document.title = "Login / Curiopost"
    const captchaRef = React.useRef(null)
    const buffer = (element, text) => {

        element.disabled = true 
        element.innerText = text || "Loading..."


    }
    const unbuffer = (element, text) => {

        element.disabled = false
        element.innerText = text 


    }

    const login = async(e) => {
        e.preventDefault();
        const captcha_token = captchaRef.current.getValue();
        if(!captcha_token) {
  return document.getElementById('bot-fail').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg> confirm that your not a robot`
        }
        buffer(document.getElementById("loginbtn"), "Logging you in..")
        const email =  document.getElementById("email").value
        const password = document.getElementById("password").value

        if(!email || !password) {
            unbuffer(document.getElementById("loginbtn"), "Login")
            return toast.error("Please fill up all  the fields!")
        }

        const resp = await fetch(urls.backend+`/api/auth/login?r_key=${captcha_token}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await resp.json()

        if(!data.success)  {
            captchaRef.current.reset();
            unbuffer(document.getElementById("loginbtn"), "Login")
           return toast.error(data.message)
        } else {
            window.localStorage.setItem("token", data.token)
            window.location.href = "/"
        }


    }

   

    return (
        <div>
           <ToastContainer/> 
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
            <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL+"/logo.png"} alt="logo" width="30" height="30" className="d-inline-block align-text-top"/> Curiopost</Link>

            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-controls="#navbarNav"  aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="nav navbar-nav mr-auto">
            <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link> 
                </li>
                <li className="nav-item">
                    <Link className="nav-link active" to="/login">Login</Link> 
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
         
        <div className="col-lg-6 offset-lg-3"  style={{"marginTop": "10%", }}>
        <h4 className="text-muted">Welcome back, we're so excited to see you again!</h4>
        <form onSubmit={login}>
            <div className="input-group mb-4 p-1">
               
            <span className="input-group-text" id="b1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
</svg></span>
            <input type="email" className="form-control"  placeholder="Email"  aria-label="Email" aria-describedby="b1" id="email"/>
           

            </div>
            <div className="input-group mb-2 p-1">
                <span id="b2" className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-fingerprint" viewBox="0 0 16 16">
  <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/>
  <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z"/>
  <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/>
  <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z"/>
  <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z"/>
</svg></span>
<input type="password" className="form-control"  placeholder="Password"  aria-label="Email" aria-describedby="b2" id="password"/>
           
           
            </div>
            <RECAPTCHA
sitekey={"6LcYoQojAAAAADYeEE1m7AQFQAgix5lP-g5rPehU"}
ref={captchaRef}
render="explicit"
required
/>
<p className="text-danger" id="bot-fail" style={{"marginBottom": "0%"}}></p>
            <button className=" btn btn-success w-100 text-center" id="loginbtn" style={{"marginBottom": "2%", marginTop: "2%"}} >Login</button>      
            </form>
     <div className="text-center"style={{"marginBottom": "2%", }}>
            <Link to="/reset_password" className="text-center text-success text-decoration-none" >Forgot your password?</Link>
                </div>
            </div>
            
            <div className="text-center">
            <p  className="text-center text-muted " >Don't have an account? <Link to="/register" className="text-success text-decoration-none">Create One!</Link></p>
           
            
            </div>
            
        </div>
        </div>
    )

}