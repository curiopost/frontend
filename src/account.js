import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import './navbar.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import urls from "./variables/urls"


export default function Account() {

    document.title = "Account Settings / Curiopost"

    const [lgin, setLgin] = useState(false)
    const [udata, setUdata] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUdata = async() => {
            const token = window.localStorage.getItem("token")
            if(!token) {
                setLgin(false)
                setUdata({})
                setLoading(false)
                return;
    
            }
    
            const sendreq = await fetch(urls.backend+"/api/auth/getuser", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                }
            })
    
            const data = await sendreq.json()
            if(data.success) {
                setUdata(data)
                setLgin(true)
                setLoading(false)
                return;
            } else {
                setUdata({})
                setLgin(false)
                setLoading(false)
                return;
    
    
            }
    }
    
    getUdata() 
    }, [])


    
    
    
    
    
    const buffer = (element, text) => {

        element.disabled = true 
        element.innerText = text || "Loading..."
    
    
    }
    const unbuffer = (element, text) => {
    
        element.disabled = false
        element.innerText = text 
    
    
    }
    const createPost =  async () => {
      const token =  window.localStorage.getItem("token")
      buffer(document.getElementById('postcreatebtn'), "Creating Post...")
      let mentions = []
      let topics = []
      let file_url = null
      const title = document.getElementById('post-title').value
      const content = document.getElementById('post-content').value
      const postFile = document.getElementById('post-file')
      if(!title)  {
        unbuffer(document.getElementById('postcreatebtn'), "Create Post")
       return toast.error("Post title is required!")
      }
      if(!content) {
        unbuffer(document.getElementById('postcreatebtn'), "Create Post")
        return toast.error("Post content is required!")
      }
    
      if(postFile.files.length > 0) {
        
        const formData = new FormData()
    
    const file = postFile.files[0]
    formData.append('attachment', file)
    const imrsp = await fetch(urls.cdn+"/upload", {
      method: "POST",
      body: formData
    })
    
    const data = await imrsp.json()
    if(data.success)  {
    file_url = data.url
    } else if(!data.success){
      unbuffer(document.getElementById('postcreatebtn'), "Create Post")
      return toast.error("Unexpected error occured  on our end, please try again!")
      
    }
    }
    
      let r = content.split(' ')
    
      for(const content of r)  {
        if(content.startsWith("#")) topics.push(content.replace('#', ''));
        else if(content.startsWith("@")) mentions.push(content.replace('@', ''))
      }
      
      
     
    
      const postup = await fetch(urls.backend+"/api/create/post",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify({
            title: title,
            content: content,
            topics: topics,
            mentions: mentions,
            attachment_url: file_url
          })
         
        
      })
    const pdata  = await postup.json()
    if(pdata.success) {
    
      buffer(document.getElementById('postcreatebtn'), "Post Created, taking you there...")
      toast.success(pdata.message)
      setTimeout(() => {
        window.location.href = `${pdata.url}`
      }, 5000)
      
    } else if(!pdata.success) {
      toast.error(pdata.message)
    }
    
    }
    
    const createQuestion = async() => {
      const token = window.localStorage.getItem("token")
      buffer(document.getElementById("qcreatebtn"), "Asking Question...")
      let mentions = []
      let topics = []
      let file_url = null
      const title = document.getElementById("q-title").value
      const content = document.getElementById("q-content").value
      const qFile = document.getElementById("q-file")
      if(!title) {
        unbuffer(document.getElementById("qcreatebtn"), "Ask Question?")
        return toast.error("Question title is required!")
      }
    
      if(!content) {
        unbuffer(document.getElementById("qcreatebtn"), "Ask Question?")
        return toast.error("Question content is required!")
      }
    
      
      
      if(qFile.files.length > 0) {
        const formData = new FormData()
    
        const file = qFile.files[0]
        formData.append('attachment', file)
    const imrsp = await fetch(urls.cdn+"/upload", {
      method: "POST",
      body: formData
    })
    
    const data = await imrsp.json()
    if(data.success)  {
    file_url = data.url
    } else if(!data.success){
      unbuffer(document.getElementById('qcreatebtn'), "Ask Question?")
      return toast.error("Unexpected error occured  on our end, please try again!")
      
    }
    }
    
    let r = content.split(' ')
    
    for(const content of r)  {
      if(content.startsWith("#")) topics.push(content.replace('#', ''));
      else if(content.startsWith("@")) mentions.push(content.replace('@', ''))
    }
    
    const qup = await fetch(urls.backend+"/api/create/question", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        title: title,
        content: content,
        topics: topics,
        mentions: mentions,
        attachment_url: file_url
      })
    })
    
    const data1 = await qup.json()
    
    if(!data1.success) {
      unbuffer(document.getElementById('qcreatebtn'), "Ask Question?")
      return toast.error(data1.message)
    } else if(data1.success) {
      buffer(document.getElementById('qcreatebtn'), "Question Asked, taking you there...")
      toast.success(data1.message)
      setTimeout(() => {
        window.location.href = `${data1.url}`
      }, 5000)
    }
    
    }

    const changePw = async() => {
        const token = window.localStorage.getItem("token")
        buffer(document.getElementById("changepwbtn"), "Changing Password...")
        const oldPw = document.getElementById("old-password").value 
        const newPw = document.getElementById("new-password").value 
        if(!oldPw) {
            unbuffer(document.getElementById("changepwbtn"), "Change Password")
           return toast.error("Old Password is required!")
        }

        if(!newPw) {
            unbuffer(document.getElementById("changepwbtn"), "Change Password")
            return toast.error("New Password is required!")
        }

        const sendUpdateReq = await fetch(urls.backend+"/api/auth/updatepassword", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({
                password: oldPw,
                newpassword: newPw
            })
        })

        const data = await sendUpdateReq.json()
        if(data.success) {
            window.localStorage.setItem("token", data.token)
            toast.success("Password Changed, reloading in 5 seconds...")
            buffer(document.getElementById("changepwbtn"), "Password Changed, reloading in 5 seconds...")
            setTimeout(() => {

                window.location.href = "/account"

            }, 5000)
        } else if(!data.success) {
            unbuffer(document.getElementById("changepwbtn"), "Change Password")
            return toast.error(data.message)
        }
    }

    const changeAvatar = async() => {
        const token = window.localStorage.getItem("token")
        let avatar_url = null 
buffer(document.getElementById('avatarupdatebtn'), 'Updating Avatar...')
const avatarFile = document.getElementById('avatar-file')

if(avatarFile.files.length > 0) {
    const formData = new FormData()
    formData.append('attachment', avatarFile.files[0])
    const uploadavtocdn = await fetch(urls.cdn+"/upload", {
        method: 'POST',
        body: formData
    })

    const cdndata = await uploadavtocdn.json()

    if(cdndata.success) {
        avatar_url = cdndata.url 
       

    } else {
        unbuffer(document.getElementById('avatarupdatebtn'), 'Change Avatar')
        return toast.error(cdndata.message)
    }
}

    const sendBackendreq = await fetch(urls.backend+"/api/update/avatar", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({
            avatar: avatar_url
        })
    })

    const data = await sendBackendreq.json()
    if(data.success) {
        document.getElementById('avatar-file').value = ''
        unbuffer(document.getElementById('avatarupdatebtn'), 'Change Avatar')
        document.getElementById('avatar-img').src= data.data.avatar_url || 'https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png'
       return toast.success('Avatar Has been updated')
      
    } else {
        unbuffer(document.getElementById('avatarupdatebtn'), 'Change Avatar')
        toast.error(data.message)
    }



    }

    const saveProfileUpdates = async() => {
        const token = window.localStorage.getItem('token')
        buffer(document.getElementById("savepchbtn"), "Saving...")
        const username = document.getElementById('aps-username').value 
        const name = document.getElementById('aps-name').value 
        const bio = document.getElementById('aps-bio').value
        const location = document.getElementById('aps-location').value
        const website = document.getElementById('aps-website').value

       const send_request = await fetch(urls.backend+"/api/update/user", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                username: username,
                name: name,
                bio: bio,
                location: location,
                website: website
            })
        })

        const data = await send_request.json()
        if(data.success) {
            toast.success(data.message)
            unbuffer(document.getElementById("savepchbtn"), "Save Changes")
            return;
        } else {
            toast.error(data.message) 
            unbuffer(document.getElementById("savepchbtn"), "Save Changes")
            return;
        }
    }

    const deleteAccount = async() => {
        const token = window.localStorage.getItem('token')
        buffer(document.getElementById('deleteaccountbtn'), 'Deleting...')

        const password = document.getElementById('deletemodal-password').value

        const feedback = document.getElementById('deletemodal-feedback').value

        const deleteAccountRequest = await fetch(urls.backend+"/api/delete/account",{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify({
                password: password,
                feedback: feedback
            })
        })

        const data = await deleteAccountRequest.json()

        if(!data.success) {
            unbuffer(document.getElementById('deleteaccountbtn'), 'Delete My Account Forever')
            return toast.error(data.message)
        } else if(data.success) {
            return window.location.href = "/"
        }
    }

    if(loading === false && lgin === true) {
return (<div><ToastContainer/>
<nav className="navbar navbar-expand-lg bg-dark navbar-dark">
<div className="container-fluid">
  <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" width="30" height="30" className="d-inline-block align-text-top" /> Curiopost</Link>

  <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-controls="#navbarNav" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
    <ul className="nav navbar-nav mr-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-house-door" viewBox="0 0 16 16">
          <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
        </svg></Link>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
          </svg>

        </a>
        <ul class="dropdown-menu dropdown-menu-dark dropstart" aria-labelledby="navbarDarkDropdownMenuLink">
          <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#postModal" style={{"cursor": "pointer"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-post-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1 0-1zm0 3h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" />
          </svg> Post</a></li>
          <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#qModal" style={{"cursor": "pointer"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z" />
          </svg> Question</a></li>

        </ul></li>

      <li className="nav-item">
        <Link className="nav-link" to="/search"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg></Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/account"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </svg></Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/notifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-bell" viewBox="0 0 16 16">
<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
</svg>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to={"/u/" + udata.raw_data.username}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
        </svg></Link>
      </li>


    </ul>


  </div>

</div>
</nav>  



<div className="feeds col-lg-6 offset-lg-3" style={{ "marginTop": "10%" }}>
    <div className="card" style={{"marginBottom": "1%"}}>
        <div className="card-body">
            <h5 className="card-title">Account Information</h5>

           
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Name:</strong> {udata.raw_data.name}</p>
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Username:</strong> {udata.raw_data.username}</p>
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Email:</strong> {udata.raw_data.email}</p>
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Bio:</strong> {udata.raw_data.bio ? udata.raw_data.bio : "No Bio Yet..."}</p>
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Location:</strong> {udata.raw_data.location ? udata.raw_data.location : "Not Specified..."}</p>
            <p className="card-text" style={{"marginBottom": "0"}}><strong>Creation Date:</strong> {new Date(udata.raw_data.created_at).toDateString()}</p>
        </div>
    </div>
    <div className="card" style={{"marginBottom": "1%"}}>
        <div className="card-body">
            <h5 className="card-title">Change Password</h5>
            <p className="card-text">Changing your password will log you out of every other devices you logged in to Curiopost.</p>
            <div className="input-group mb-4 p-1">
      <span className="input-group-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16">
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
</svg>
      </span>
      <input type="password" className="form-control" id="old-password" placeholder="Current Password"  />
      </div>
      <div className="input-group mb-4 p-1">
    <span className="input-group-text">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-fingerprint" viewBox="0 0 16 16">
  <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/>
  <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z"/>
  <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/>
  <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z"/>
  <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z"/>
</svg>
      </span>
      <input autocomplete="new-password" type="password" className="form-control" id="new-password" placeholder="New Password"  />
      </div>
      <button className="btn btn-success w-100" id="changepwbtn" onClick={changePw}>Change Password</button>
        </div>
    </div>
    <div className="card" style={{"marginBottom": "1%"}}>
        <div className="card-body">
            <h5 className="card-title">Profile Avatar</h5>
            <p className="card-text">To remove your current avatar just click the "Change Avatar" button without adding a file. To add one click the 'Choose File' or 'No File Chosen' then select your image and click the "Change Avatar" button.</p>
           <div className=" text-center">
                <img id="avatar-img" height={128} width={128} style={{"borderRadius": "50%"}}src={udata.raw_data.avatar_url ? udata.raw_data.avatar_url : 'https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png'}></img>
            
                </div>
                <br/>
                <label for="avatar-file" style={{"marginRight": "1%"}}>Choose File </label>
          <input style={{"marginBottom": "2%"}}type="file" className="avatar-file" id="avatar-file" name="avatar-file" accept="image/png, image/jpg, image/jpeg" onPaste={(e) => {document.getElementById('post-file').files = e.clipboardData.files}}/>
<button className="btn btn-success w-100" id="avatarupdatebtn" onClick={changeAvatar}>Change Avatar</button>
       
                
                 </div>
                
        </div>
        <div className="card" style={{"marginBottom": "1%"}}>
            <div className="card-body">
                <h5 className="card-title">Profile Settings</h5>
                <p className="card-text">These things will appear on your page. Your username is the part that creates the link to your profile.</p>
                <div className="input-group mb-4 p-1">
                    <span data-toggle="tooltip" data-placement="top" title="Username" className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-at" viewBox="0 0 16 16">
  <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/>
</svg></span>
                    <input type="text" className="form-control" id="aps-username" placeholder="Username" defaultValue={udata.raw_data.username}  />
                    </div>
                    <div className="input-group mb-4 p-1">
                        <span data-toggle="tooltip" data-placement="top" title="Display Name" className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg></span>
<input type="text" className="form-control" id="aps-name" placeholder="Display Name" defaultValue={udata.raw_data.name}/>
                    </div>
                    <div className="input-group mb-4 p-1">
                        <span data-toggle="tooltip" data-placement="top" title="Bio" className="input-group-text">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alien" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M11 17a2.5 2.5 0 0 0 2 0" />
  <path d="M12 3c-4.664 0 -7.396 2.331 -7.862 5.595a11.816 11.816 0 0 0 2 8.592a10.777 10.777 0 0 0 3.199 3.064c1.666 1 3.664 1 5.33 0a10.777 10.777 0 0 0 3.199 -3.064a11.89 11.89 0 0 0 2 -8.592c-.466 -3.265 -3.198 -5.595 -7.862 -5.595z" />
  <line x1="8" y1="11" x2="10" y2="13" />
  <line x1="16" y1="11" x2="14" y2="13" />
</svg></span>
<textarea  className="form-control" id="aps-bio" placeholder="Bio" defaultValue={udata.raw_data.bio ? udata.raw_data.bio : null} maxLength={200} rows="3"></textarea>
                    </div>
                    <div className="input-group mb-4 p-1">
                    <span data-toggle="tooltip" data-placement="top" title="Location" className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>
                        </span>
                        <input type="text" className="form-control" id="aps-location" placeholder="Location" defaultValue={udata.raw_data.location ? udata.raw_data.location : null}/>
                        </div>
                        <div className="input-group mb-4 p-1">
                        <span data-toggle="tooltip" data-placement="top" title="website" className="input-group-text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
</svg>
                            </span> 
                            <input type="text" className="form-control" id="aps-website" placeholder="Website" defaultValue={udata.raw_data.website ? udata.raw_data.website : null}/>
                        </div>
                        <button className="btn btn-success w-100" id="savepchbtn" onClick={saveProfileUpdates}>Save Changes</button>
            </div>
        </div>
        <div className="card" style={{"marginBottom": "1%"}}>
            <div className="card-body">
                <h5 className="card-title">Danger Zone</h5>
                <p style={{"marginBottom": "9px"}}>Warning: Things done here cannot be undone! Make sure you know what your doing...</p>
                <Link className="btn btn-danger w-50" to="/logout" style={{"marginBottom": "1%"}}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
</svg> Sign Out</Link><br/>
<button className="btn btn-danger w-50" data-bs-toggle="modal" data-bs-target="#deleteModal"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg> Delete Account</button>
                
            </div>
        </div>
    </div>


    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModallabel" >Danger! Deleting your Account!</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="input-group mb-4 p-1">
      <span data-toggle="tooltip" data-placement="top" title="Password" className="input-group-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-fingerprint" viewBox="0 0 16 16">
  <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/>
  <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z"/>
  <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/>
  <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z"/>
  <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z"/>
</svg>
        </span>
        <input type="password" className="form-control" id="deletemodal-password" placeholder="Password" autocomplete="current-password"/>
        </div>
        <div className="input-group mb-4 p-1">
        <span data-toggle="tooltip" data-placement="top" title="Feedback" className="input-group-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
  <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
</svg>
            </span>
           <textarea className="form-control" id="deletemodal-feedback" placeholder='Optional feedback, example - "Trash Platform."'></textarea>
            </div>
      </div>
      <div class="modal-footer">
        
        <button className="btn btn-danger w-100" id="deleteaccountbtn" onClick={deleteAccount}>Delete My Account Forever</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="postModal" tabindex="-1" aria-labelledby="postModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="postModallabel">Create a new post</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="input-group mb-4 p-1">
      <span id="b2" className="input-group-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-right-dots" viewBox="0 0 16 16">
  <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
  <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg>
      </span>
      <input type="text" className="form-control" id="post-title" placeholder="Post title... Whats on your mind?" maxLength={50} />
      </div>
      <div className="input-group mb-4 p-1">
        <span id="b3" className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-blockquote-left" viewBox="0 0 16 16">
  <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z"/>
</svg></span>
<textarea rows="3" class="form-control" id="post-content" maxLength={500} placeholder="Describe your post... You can @mention users and add #tags for topics."></textarea>
      </div>
      <div className="input-group mb-4 p-1">
        <span id="b4" className="input-group-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
</svg>
        </span>
          <input type="file" class="form-control" id="post-file" name="post-file" accept="image/*, video/*" onPaste={(e) => {document.getElementById('post-file').files = e.clipboardData.files}}/>

      </div>
      </div>
      <div class="modal-footer">
        
        <button type="button" class="btn btn-success w-100" onClick={createPost} id="postcreatebtn">Create Post</button>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="qModal" tabindex="-1" aria-labelledby="qModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="qModallabel">Ask a new question?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div className="input-group mb-4 p-1">
      <span id="b2" className="input-group-text">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
</svg>
      </span>
      <input type="text" className="form-control" id="q-title" placeholder="Question title... What are you asking?" maxLength={50} />
      </div>
      <div className="input-group mb-4 p-1">
        <span id="b3" className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-blockquote-left" viewBox="0 0 16 16">
  <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z"/>
</svg></span>
<textarea rows="3" class="form-control" id="q-content" maxLength={700} placeholder="Explain more about what your asking... You can @mention users and add #tags for topics."></textarea>
      </div>
      <div className="input-group mb-4 p-1">
        <span id="b4" className="input-group-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
</svg>
        </span>
          <input type="file" class="form-control" id="q-file" name="q-file" accept="image/*, video/*" onPaste={(e) => {document.getElementById('q-file').files = e.clipboardData.files}}/>

      </div>
      </div>
      <div class="modal-footer">
        
        <button type="button" class="btn btn-success w-100"  id="qcreatebtn" onClick={createQuestion}>Ask Question?</button>
      </div>
    </div>
  </div>
</div>
</div>)
    } else if(loading === false && lgin === false) {
        return <Navigate to="/login"/>
    } else {
        return <p>Loading...</p>
    }

}