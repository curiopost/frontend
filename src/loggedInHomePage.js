import urls from "./variables/urls"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import './navbar.css'
import './feeds.css'
import getFileType from "./functions/getFileType"
import DOMPurify from "dompurify"

import ReactDOMServer from 'react-dom/server';
  
export default function Feeds(props) {

document.title = `Curiopost (@${props.data.raw_data.username})`

useEffect(() => {
  
  const getFeeds = async () => {
  const token = window.localStorage.getItem("token")

 const rsp = await fetch(urls.backend+"/api/read/feeds", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token

    }
  })

  const data = await rsp.json()

  if(!data.success) {
    return;
  } else {
  document.getElementById("feeds").innerHTML = null
  

data.feeds.forEach(feed => {
  let filetype;
  
  if(feed.attachment_url) { 
    filetype = getFileType(feed.attachment_url)
  } else if(!feed.attachment_url) {
    filetype = null
  }

  const clean_feed_content = DOMPurify.sanitize(feed.content, {ALLOWED_TAGS: []})
  const clean_feed_title = DOMPurify.sanitize(feed.title, {ALLOWED_TAGS: []})
  const cleanName = DOMPurify.sanitize(feed.name, {ALLOWED_TAGS: []})
  function URLify(string){
    var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
    if (urls) {
      urls.forEach(function (url) {
        string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
      });
    }
    return string.replace("(", "<br/>(");
  }
  const content = URLify(clean_feed_content)
  
    document.getElementById("feeds").innerHTML += `<a class="text-decoration-none text-dark"><div class="card" style="width: 100%;" aria-hidden="true">
      <div class="card-body">
      <a href=/u/${feed.username} class="text-decoration-none text-dark"><img src=${feed.avatar_url} class="rounder" alt="logo" width="25" height="25" onerror="this.src='https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png'">
      <p class="text-muted" style="margin-bottom: 0;"><strong>${cleanName} (@${feed.username})</strong></p></a>
  
        <h5 class="card-title">${clean_feed_title} <small>(${feed.type.toLowerCase()})</small></h5>
        
        <p>${content}</p>
        
        ${filetype === "video" ?  `<div class="ratio ratio-16x9"><video controls>
        <source src=${feed.attachment_url} type="video/mp4">
        </video></div>` : `<div></div>`}
        ${filetype === "image" ? `<img src=${feed.attachment_url} class="img-fluid card-image" alt="post Image">` : `<div></div>`}
      
      </div>
    </div>
    </a><br/>`
})

data.recommendations.forEach(feed => {
  
  let filetype;
  
  if(feed.attachment_url) { 
    filetype = getFileType(feed.attachment_url)
  } else if(!feed.attachment_url) {
    filetype = null
  }

  const clean_feed_content = DOMPurify.sanitize(feed.content, {ALLOWED_TAGS: []})
  const clean_feed_title = DOMPurify.sanitize(feed.title, {ALLOWED_TAGS: []})
  const cleanName = DOMPurify.sanitize(feed.name, {ALLOWED_TAGS: []})
  function URLify(string){
    var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
    if (urls) {
      urls.forEach(function (url) {
        string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
      });
    }
    return string.replace("(", "<br/>(");
  }
  const content = URLify(clean_feed_content)
  
    document.getElementById("feeds").innerHTML += `<a class="text-decoration-none text-dark"><div class="card" style="width: 100%;" aria-hidden="true">
      <div class="card-body">
      <a href=/u/${feed.username} class="text-decoration-none text-dark"><img src=${feed.avatar_url} class="rounder" alt="logo" width="25" height="25" onerror="this.src='https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png'">
      <p class="text-muted" style="margin-bottom: 0;"><strong>${cleanName} (@${feed.username})</strong></p></a>
  
        <h5 class="card-title">${clean_feed_title} <small>(${feed.type.toLowerCase()})</small></h5>
        
        <p>${content}</p>
        
        ${filetype === "video" ?  `<div class="ratio ratio-16x9"><video controls>
        <source src=${feed.attachment_url} type="video/mp4">
        </video></div>` : `<div></div>`}
        ${filetype === "image" ? `<img src=${feed.attachment_url} class="img-fluid card-image" alt="post Image">` : `<div></div>`}
      
      </div>
    </div>
    </a><br/>`
})
  }
  }

  getFeeds()

}, [])



    return  (
        <div>
          
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
            <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL+"/logo.png"} alt="logo" width="30" height="30" className="d-inline-block align-text-top"/> Curiopost</Link>

            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-controls="#navbarNav"  aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="nav navbar-nav mr-auto">
            <li className="nav-item">
            <Link className="nav-link" to="/"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-house-door" viewBox="0 0 16 16">
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
</svg></Link> 
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link"  id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
</svg>
         
</a> 
<ul class="dropdown-menu dropdown-menu-dark dropstart" aria-labelledby="navbarDarkDropdownMenuLink">
            <li><a class="dropdown-item" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-post-fill" viewBox="0 0 16 16">
  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1 0-1zm0 3h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/>
</svg> Post</a></li>
            <li><a class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z"/>
</svg> Question</a></li>
            
          </ul></li>
                
                    <li className="nav-item">
                    <Link className="nav-link" to="/search"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg></Link> 
                    </li>
                    
                    <li className="nav-item">
                    <Link className="nav-link" to="/account"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-gear" viewBox="0 0 16 16">
  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
</svg></Link> 
                    </li>
              
                    <li className="nav-item">
                    <Link className="nav-link" to={"/u/"+props.data.raw_data.username}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
</svg></Link>
                    </li>
                    

            </ul>
            
            
            </div>
            
        </div>
        </nav>
        <div  className="topics float-end" style={{ "marginTop": "10%", "marginRight": "1%", "marginLeft": "1%", width: "20rem"}}>
        <div className="card" aria-hidden="true">

  <div className="card-body">
    <h5 className="card-title placeholder-glow">
     Topics For You
    </h5>
    <p className="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
    </p>
    
  </div>
</div>
</div>
      
            <div className="feeds col-lg-7 offset-lg-2" id="feeds" style={{"marginTop": "10%"}}>
          
            <div className="card" aria-hidden="true">
 
  <div className="card-body">
    <h5 className="card-title placeholder-glow">
      <span className="placeholder col-6"></span>
    </h5>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
     
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
   
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>
    <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p> <p class="card-text placeholder-glow">
      <span className="placeholder col-7"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-4"></span>
      <span className="placeholder col-6"></span>
      <span className="placeholder col-8"></span>
      
    </p>

  </div>
</div>

                </div>
                <br/><br/><br/><br/>
    
           
        </div>
    )

}