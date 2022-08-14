import urls from "./variables/urls"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import './navbar.css'
import './feeds.css'
import getFileType from "./functions/getFileType"
import DOMPurify from "dompurify"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOMServer from 'react-dom/server';

export default function Feeds(props) {

  let [feeds, setFeeds] = useState([<div className="card" aria-hidden="true"><div className="card-body"> <h5 className="card-title placeholder-glow"> <span className="placeholder col-6"></span> </h5> <p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p><p class="card-text placeholder-glow"> <span className="placeholder col-7"></span> <span className="placeholder col-4"></span> <span className="placeholder col-4"></span> <span className="placeholder col-6"></span> <span className="placeholder col-8"></span> </p></div></div>])
  const [loading, setLoading] = useState(true)

  document.title = `Curiopost (@${props.data.raw_data.username})`

  

  useEffect(() => {
 
    const like = async(id) => {
      document.getElementById(`likebtn${id}`).style.display = "none"
      document.getElementById(`unlikebtn${id}`).style.display = "block"
      
      const token = window.localStorage.getItem("token")
      const sendL = await fetch(urls.backend+`/api/update/like?type=post&id=${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "token": token
        }

      })

      const data = await sendL.json()

      if(!data.success) {
        return toast.error(data.message)
      } else {
       
        document.getElementById(`likes_${id}`).innerText = data.likes

      }

    }

    const unlike = async(id) => {
      document.getElementById(`unlikebtn${id}`).style.display = "none"
      document.getElementById(`likebtn${id}`).style.display = "block"
      const token = window.localStorage.getItem("token")
      const sendL = await fetch(urls.backend+`/api/update/unlike?type=post&id=${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "token": token
        }

      })

      const data = await sendL.json()

      if(!data.success) {
        return toast.error(data.message)
      } else {
       
        document.getElementById(`likes_${id}`).innerText = data.likes

      }

    }
    const share = (id, type) => {
      navigator.clipboard.writeText(`https://curiopost.live/${type}/${id}`).then(n => {
        return toast.success("Copied shareable link to clipboard!")
      })
    }
    const getFeeds = async () => {
      const token = window.localStorage.getItem("token")

      


      const rsp = await fetch(urls.backend + "/api/read/feeds", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token

        }
      })

      const data = await rsp.json()

      setLoading(false)

      if (!data.success) {
        return;
      } else {
        document.getElementById("feeds").innerHTML = null

 
        data.feeds.forEach(feed => {
          let filetype;

          if (feed.attachment_url) {
            filetype = getFileType(feed.attachment_url)
          } else if (!feed.attachment_url) {
            filetype = null
          }

          const clean_feed_content = DOMPurify.sanitize(feed.content, { ALLOWED_TAGS: [] })
          const clean_feed_title = DOMPurify.sanitize(feed.title, { ALLOWED_TAGS: [] })
          const cleanName = DOMPurify.sanitize(feed.name, { ALLOWED_TAGS: [] })
          function URLify(string) {
            var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
            if (urls) {
              urls.forEach(function (url) {
                string = string.replace(url, '<a class="text-decoration-none" target="_blank" href="' + url + '">' + url + "</a>");
              });
            }
            return  string.replace("(", "<br/>(");
          }
          function replaceAtMentionsWithLinks ( text ) {
            return text.replace(/@([a-z\d_]+)/ig, '<a class="text-decoration-none" href="/u/$1">@$1</a>'); 
        }

          const content1 = URLify(clean_feed_content)
          const content2 = replaceAtMentionsWithLinks(content1)
          const content = content2.replace(/#(\S*)/g,'<a class="text-decoration-none" href="/topics/$1">#$1</a>');

          setFeeds(feeds => [...feeds, <div>
            <div className="card" style={{"width": "100%;"}} >
            <div className="card-body">
            <p className="float-end text-muted">{feed.created_date}</p>
            <Link to={"/u/"+feed.username} className="text-decoration-none text-dark"><img src={feed.avatar_url ? feed.avatar_url: "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"} class="rounder" alt="logo" width="25" height="25"/>
            <p className="text-muted" style={{"marginBottom": "0"}}><strong>{cleanName} (@{feed.username})</strong></p></Link>
        
              <h5 className="card-title">{clean_feed_title} <small>({feed.type.toLowerCase()})</small></h5>
              <div dangerouslySetInnerHTML={{__html:content}}/>
              
              
              {filetype === "video" ? <div className="ratio ratio-16x9"><video controls>
              <source src={feed.attachment_url} type="video/mp4"/>
              </video></div> : <div></div>}
              {filetype === "image" ? <img src={feed.attachment_url} class="img-fluid card-image" alt="post Image"/> : <div></div>}
              
            </div>
            <div id="like-section" className="d-flex" style={{"cursor": "pointer", "marginLeft": "20px", "marginRight": "5px", "marginBottom": "0"}}>
              { feed.likes.includes(props.data.raw_data._id) ?<div>
   <a id={"unlikebtn"+feed._id} onClick={() => {unlike(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg></a>
<a id={"likebtn"+feed._id} onClick={() => {like(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg></a></div>:<div>
<a id={"likebtn"+feed._id} onClick={() => {like(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg></a>  <a id={"unlikebtn"+feed._id} onClick={() => {unlike(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg></a></div>
}
<p id={"likes_"+feed._id}>{feed.total_likes}</p>  <a href={"/"+feed.type.toLowerCase()+"s/"+feed._id}style={{"cursor": "pointer", "marginLeft": "6px",}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
<path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg></a>
<a onClick={( ()=> {share(feed._id, feed.type.toLowerCase()+"s")})} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" class="bi bi-share" viewBox="0 0 16 16">
<path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg></a>
{props.data.raw_data.username === feed.username ? <><Link  to={"/"+feed.type.toLowerCase()+"s/"+feed._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></Link>
<Link to={"/"+feed.type.toLowerCase()+"s/"+feed._id+"/delete"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></Link> 
</>


: <></>}
</div>

          </div>
          <br/>
          </div>])
        })



        data.recommendations.forEach(feed => {

          let filetype;

          if (feed.attachment_url) {
            filetype = getFileType(feed.attachment_url)
          } else if (!feed.attachment_url) {
            filetype = null
          }

          const clean_feed_content = DOMPurify.sanitize(feed.content, { ALLOWED_TAGS: [] })
          const clean_feed_title = DOMPurify.sanitize(feed.title, { ALLOWED_TAGS: [] })
          const cleanName = DOMPurify.sanitize(feed.name, { ALLOWED_TAGS: [] })
          function URLify(string) {
            var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
            if (urls) {
              urls.forEach(function (url) {
                string = string.replace(url, '<a class="text-decoration-none" target="_blank" href="' + url + '">' + url + "</a>");
              });
            }
            return  string.replace("(", "<br/>(");
          }
          function replaceAtMentionsWithLinks ( text ) {
            return text.replace(/@([a-z\d_]+)/ig, '<a class="text-decoration-none" href="/u/$1">@$1</a>'); 
        }

          const content1 = URLify(clean_feed_content)
          const content2 = replaceAtMentionsWithLinks(content1)
          const content = content2.replace(/#(\S*)/g,'<a class="text-decoration-none" href="/topics/$1">#$1</a>');

          setFeeds(feeds => [...feeds, <div>
            <div className="card" style={{"width": "100%;"}} >
            
            <div className="card-body">
            <p className="float-end text-muted">{feed.created_date}</p>
            <Link to={"/u/"+feed.username} className="text-decoration-none text-dark"><img src={feed.avatar_url ? feed.avatar_url: "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"} class="rounder" alt="logo" width="25" height="25"/>
            <p className="text-muted" style={{"marginBottom": "0"}}><strong>{cleanName} (@{feed.username})</strong></p></Link>
        
              <h5 className="card-title">{clean_feed_title} <small>({feed.type.toLowerCase()})</small></h5>
              <div dangerouslySetInnerHTML={{__html:content}}/>
              
              
              {filetype === "video" ? <div className="ratio ratio-16x9"><video controls>
              <source src={feed.attachment_url} type="video/mp4"/>
              </video></div> : <div></div>}
              {filetype === "image" ? <img src={feed.attachment_url} class="img-fluid card-image" alt="post Image"/> : <div></div>}
              
            </div>
            <div id="like-section" className="d-flex" style={{"cursor": "pointer", "marginLeft": "20px", "marginRight": "5px", "marginBottom": "0"}}>
              { feed.likes.includes(props.data.raw_data._id) ?<div>
   <a id={"unlikebtn"+feed._id} onClick={() => {unlike(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg></a>
<a id={"likebtn"+feed._id} onClick={() => {like(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg></a></div>:<div>
<a id={"likebtn"+feed._id} onClick={() => {like(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg></a>  <a id={"unlikebtn"+feed._id} onClick={() => {unlike(feed._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg></a></div>
}
<p id={"likes_"+feed._id}>{feed.total_likes}</p>  <a href={"/"+feed.type.toLowerCase()+"s/"+feed._id}style={{"cursor": "pointer", "marginLeft": "6px",}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
<path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg></a>
<a onClick={( ()=> {share(feed._id, feed.type.toLowerCase()+"s")})} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" class="bi bi-share" viewBox="0 0 16 16">
<path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg></a>
{props.data.raw_data.username === feed.username ? <><Link  to={"/"+feed.type.toLowerCase()+"s/"+feed._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></Link>
<Link to={"/"+feed.type.toLowerCase()+"s/"+feed._id+"/delete"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></Link> 
</>


: <></>}
</div>

          </div>
          <br/>
          </div>])
          
        })

        let interests = [...new Set(data.topics)]
        
        document.getElementById('topics').innerHTML = null;
        if(interests.length < 1) return document.getElementById("thetopics").innerHTML = `<p>We don't really know what you like yet.. Like some posts and follow some users so we can find topics interesting to you!</p>`
        const bl = []
        interests.forEach(p => {
          if(bl.includes(p)) return;

          const i = DOMPurify.sanitize(p, {ALLOWED_TAGS: []})
         
document.getElementById('thetopics').innerHTML+= `<a href="/topics/${i}" class="list-group-item list-group-item-action">#${i}</a>`
bl.push(i)
        })
      }
    }

    getFeeds()

  }, [])



  return (
    <div>
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
                  <li><a class="dropdown-item" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-post-fill" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1 0-1zm0 3h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" />
                  </svg> Post</a></li>
                  <li><a class="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
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
                <Link className="nav-link" to={"/u/" + props.data.raw_data.username}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg></Link>
              </li>


            </ul>


          </div>

        </div>
      </nav>
      <div className="topics float-end" style={{ "marginTop": "10%", "marginRight": "1%", "marginLeft": "1%", width: "20rem" }}>
        <div className="card" aria-hidden="true">

          <div className="card-body">
            <h5 className="card-title placeholder-glow">
              Topics For You
            </h5>
            <ul id="thetopics" class="list-group"></ul>
            <div id="topics">
            
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
      </div>

      <div className="feeds col-lg-7 offset-lg-2" id="feeds" style={{ "marginTop": "10%" }}>

        {feeds}
      </div>
      <br /><br /><br /><br />


    </div>
  )

}