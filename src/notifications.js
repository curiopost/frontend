import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import './navbar.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import urls from "./variables/urls"

export default function Notifications() {

    const [lgin, setLgin] = useState(false)
    const [udata, setUdata] = useState({})
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState([<> <div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div><div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div><div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div><div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div><div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div><div className="card" style={{"marginBottom": '2%'}}> <div className="card-body"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </div></div></>])

    document.title = "Notifications / Curiopost"

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

useEffect(() =>{ 


    const setNotifis = async() => {
       
        const notifis = udata.raw_data.notifications.sort((a,b) => (parseFloat(b.created_at) - parseFloat(a.created_at)))
        if(notifis.length > 0) {
 
    } else {
        setNotifications([])
        setNotifications(notifications => [...notifications, <div className="card">
            <div className="card-header">
    
            <h5 style={{"marginBottom": "0"}}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
</svg> No Notifications yet... {":("}</h5>
</div>
<div className="card-body">
    <p className="card-text">When someone mentions you or someone you follow posts or asks a question, they'll appear here...</p>
</div>
          
        </div>])
        return;
    }
        notifis.forEach(n => {
            setNotifications(notifications => [...notifications, 
            <Link to={n.url} className="text-decoration-none" style={{"color": "inherit"}}>
            <div className="card" style={{"marginBottom": "1%"}}>
            <div className="card-header"> <p className="float-end text-muted" style={{"marginBottom": "0"}}>{new Date(n.created_at).toDateString()}</p>
            <h5 style={{"marginBottom": "0"}}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
</svg> Notification</h5>
           </div>
                <div className="card-body">
                
                    <h5 className="card-title">{n.reason}</h5>
                    <Link to={n.url} className="card-text text-decoration-none" style={{"color": "inherit"}}>{n.type==='REPLY' ? <strong>A user just mentioned you in a reply. Click to see it!</strong> : <strong>{n.title}</strong>}</Link>
                </div>
                </div>
                </Link>])

        })
      
    }
    
    if(loading === false && lgin === true) {
        setNotifications([])
        setNotifis()
    }
}, [loading])
    
    
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
    
    
    
    if(loading === false && lgin === true) {
        return (<div>
          <ToastContainer/>
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

      {notifications}    
      
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
        return <p>loading...</p>
    }


}