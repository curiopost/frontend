import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import urls from "./variables/urls"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './navbar.css'
import getFileType from "./functions/getFileType"
import DOMPurify from "dompurify"

export default function ViewPost(props) {
    const {type, id} = useParams()
    const islgin = props.islgin
 
const udata = props.data
    const [post, setPost] = useState([<p className="text-center" style={{"marginTop": "15%"}}>Loading post...</p>])
    const [replies, setReplies] = useState([])
    const [rcount, setRcount] = useState([])

useEffect(() => {
    
    const like = async(id, type10) => {
       if(!islgin) {
           return toast.error("Please login to like posts and questions!")
        }
        document.getElementById(`likebtn${id}`).style.display = "none"
        document.getElementById(`unlikebtn${id}`).style.display = "block"
        
        const token = window.localStorage.getItem("token")
        const sendL = await fetch(urls.backend+`/api/update/like?type=${type10 || "post"}&id=${id}`, {
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
  
      const unlike = async(id, type10) => {
        if(!islgin) {
            return toast.error("Please login to like posts and questions!")
         }
        document.getElementById(`unlikebtn${id}`).style.display = "none"
        document.getElementById(`likebtn${id}`).style.display = "block"
        const token = window.localStorage.getItem("token")
        const sendL = await fetch(urls.backend+`/api/update/unlike?type=${type10 || "post"}&id=${id}`, {
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



const setThePost = async(type1) => {
  function textAreaAdjust(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

    if(!id) {
       return setPost([<p className="text-center" style={{"marginTop": "15%"}}>Post not found...</p>])
    }
  if(type1 === "post" || type1==="question") {
  
        const getThePost = await fetch(urls.backend+`/api/read/${type1}?id=${id}`, {
            method: "GET"
        })

        const data = await getThePost.json() 
        
        if(data.success) {
            document.title = `${data.raw_data.title} on Curiopost`
            let filetype;
            const cleanDescription = DOMPurify.sanitize(data.raw_data.content, {ALLOWED_TAGS: []})
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

            const content0 = URLify(cleanDescription)
            const content1 = replaceAtMentionsWithLinks(content0)
            const content2 = content1.replace(/#(\S*)/g,'<a class="text-decoration-none" href="/topics/$1">#$1</a>');
            if(data.raw_data.attachment_url) {
                filetype = getFileType(data.raw_data.attachment_url)
            } else {
                filetype = null
            }
            setPost([<>
                <div className="card" style={{"marginTop": "15%"}}>
                    <div className="card-body">
                        <p className="float-end text-muted">{data.processed_data.created_at}</p>
                        <Link className="text-decoration-none text-dark" to={"/u/"+data.processed_data.username}>
                            <img className="rounded" alt="logo" width="25" height="25" src={data.processed_data.avatar_url ? data.processed_data.avatar_url : "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"}></img>
                            <p className="text-muted" style={{"marginBottom": "0"}}>
                                <strong>{data.processed_data.name} (@{data.processed_data.username})</strong>
                            </p>
                        </Link>
                        <h5 className="card-title">{data.raw_data.title}</h5>
                        <div dangerouslySetInnerHTML={{__html:content2}}/>
                        {filetype === "video" ? <div className="ratio ratio-16x9">
                        <video controls preload="metadata" controlsList="nodownload">
                        <source src={data.raw_data.attachment_url} type="video/mp4"/>
                        </video>
                        </div> : <></>}
                        {filetype === "image" ? <div className="text-center"><img src={data.raw_data.attachment_url} class="img-fluid card-image rounded" alt="post Image" style={{width: '100%', maxHeight: '90vh'}}/></div> : <></>}
                        </div>
                        <div id="like-section" className="d-flex" style={{"cursor": "pointer", "marginLeft": "20px", "marginRight": "5px", "marginBottom": "0"}}>
                    
                {islgin && data.raw_data.likes.includes(udata.raw_data._id) ?<div>
     <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a></div>:<div>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a>  <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id)}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a></div>
  }
  <p id={"likes_"+data.raw_data._id}>{data.processed_data.total_likes}</p>  <a href={"/"+type1+"s/"+data.raw_data._id}style={{"cursor": "pointer", "marginLeft": "6px",}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
  <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg></a>
  <a onClick={( ()=> {share(data.raw_data._id, type1+"s")})} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" class="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
  </svg></a>
  {islgin && udata.raw_data.username === data.processed_data.username ? <><Link  to={"/"+type1+"s/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg></Link>
  <Link to={"/"+type1+"s/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  </svg></Link> 
  </>
  
  
  : <></>}</div>
                   

                </div>
      


                {islgin ? <>
               <div className="input-group" style={{"marginTop":"10px", "marginBottom": "10px"}}>
               
                <textarea className="form-control" rows="1" placeholder="Reply Content..." id="reply-content" onKeyUp={() => {textAreaAdjust(document.getElementById('reply-content'))}}></textarea>
           
           <input type="file" className="input-group-text " id="reply-file" name="reply-file" accept="image/*, video/*" style={{"width": "128px"}}></input>
          
                  <button className="btn btn-primary" onClick={createReply} id="replycreatebtn">Reply</button>
                  
                  
         
          
               </div>         </>: <></>
            }
            
                </>])
const getPostReplies = await fetch(urls.backend+`/api/read/replies?post_id=${id}`, {
  method: 'GET'
})


const replyD = await getPostReplies.json()
setReplies([])
if(replyD.success) {

  setRcount([<h5 className="text-muted text-center" style={{"marginTop": "1%"}}>{ replyD.total_replies !== 1 ? replyD.total_replies+ " Replies": replyD.total_replies+" Reply"} </h5>])
  
 const rdata = replyD.data.sort((a,b) => (parseFloat(b.likes.length) - parseFloat(a.likes.length)))
 rdata.forEach(data => {
    data.raw_data = data 
    data.processed_data = data
    let filetype;
    const cleanDescription = DOMPurify.sanitize(data.raw_data.content, {ALLOWED_TAGS: []})
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

    const content0 = URLify(cleanDescription)
    const content1 = replaceAtMentionsWithLinks(content0)
    const content2 = content1.replace(/#(\S*)/g,'<a class="text-decoration-none" href="/topics/$1">#$1</a>');
    if(data.raw_data.attachment_url) {
        filetype = getFileType(data.raw_data.attachment_url)
    } else {
        filetype = null
    }
setReplies(replies => [...replies, <>
        <div className="card" style={{"marginTop": "2%"}}>
                    <div className="card-body">
                        <p className="float-end text-muted">{data.processed_data.created_date}</p>
                        <Link className="text-decoration-none text-dark" to={"/u/"+data.processed_data.username}>
                            <img className="rounded" alt="logo" width="25" height="25" src={data.processed_data.avatar_url ? data.processed_data.avatar_url : "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"}></img>
                            <p className="text-muted" style={{"marginBottom": "0"}}>
                                <strong>{data.processed_data.name} (@{data.processed_data.username})</strong>
                            </p>
                        </Link>
                       
                        <div dangerouslySetInnerHTML={{__html:content2}}/>
                        {filetype === "video" ? <div className="ratio ratio-16x9">
                        <video controls preload="metadata" controlsList="nodownload">
                        <source src={data.raw_data.attachment_url} type="video/mp4"/>
                        </video>
                        </div> : <></>}
                        {filetype === "image" ? <div className="text-center"><img src={data.raw_data.attachment_url} class="img-fluid card-image rounded" style={{width: '100%', maxHeight: '90vh'}} alt="post Image"/></div> : <></>}
                        </div>
                        <div id="like-section" className="d-flex" style={{"cursor": "pointer", "marginLeft": "20px", "marginRight": "5px", "marginBottom": "0"}}>
                    
                {islgin && data.raw_data.likes.includes(udata.raw_data._id) ?<div>
     <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a></div>:<div>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a>  <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a></div>
  }
  <p id={"likes_"+data.raw_data._id}>{data.processed_data.total_likes}</p>  <a href={"/"+"replies/"+data.raw_data._id}style={{"cursor": "pointer", "marginLeft": "6px",}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
  <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg></a>
  <a onClick={( ()=> {share(data.raw_data._id, "replies")})} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" class="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
  </svg></a>
  {islgin && udata.raw_data.username === data.processed_data.username ? <><Link  to={"/"+"replies/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg></Link>
  <Link to={"/"+"replies/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  </svg></Link> 
  </>
  
  
  : <></>}</div>
                   

                </div>
</>])
  })
}

        
    
    } else {
        setPost([<p className="text-center" style={{"marginTop": "15%"}}>{data.message}</p>])
    }
}
    
}

const setTheReply = async() => {
  document.title = `Viewing a Reply / Curiopost`
  const getTheReply = await fetch(urls.backend+`/api/read/reply?id=${id}`, {
    method: 'GET'
  })

  const data = await getTheReply.json()

  if(!data.success) {
  
    setPost([<p className="text-center" style={{"marginTop": "15%"}}>{data.message}</p>])
  } else {
    let filetype;

    if (data.raw_data.attachment_url) {
      filetype = getFileType(data.raw_data.attachment_url)
    } else if (!data.raw_data.attachment_url) {
      filetype = null
    }
    
    const clean_feed_content = DOMPurify.sanitize(data.raw_data.content, { ALLOWED_TAGS: [] })
   
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
    setPost([<>
    <div className="card"  style={{"marginTop": "15%"}}>
      <div className="card-body">
      <p className="float-end text-muted">{data.processed_data.created_at}</p>
      <Link to={"/u/"+data.processed_data.username} className="text-decoration-none text-dark"><img src={data.processed_data.avatar_url ? data.processed_data.avatar_url: "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"} class="rounded" alt="logo" width="25" height="25"/>
      <p className="text-muted" style={{"marginBottom": "0"}}><strong>{data.processed_data.name} (@{data.processed_data.username})</strong></p>
      </Link>
        <h5 className="card-title">Replying to '{data.processed_data.replied_title}'</h5>
        <div dangerouslySetInnerHTML={{__html:content}}/>
        {filetype === "video" ? <div className="ratio ratio-16x9"><video controls preload="metadata" controlsList="nodownload">
              <source src={data.raw_data.attachment_url} type="video/mp4"/>
              </video></div> : <div></div>}
              {filetype === "image" ? <div className="text-center"><img src={data.raw_data.attachment_url} class="img-fluid card-image rounded" style={{width: '100%', maxHeight: '90vh'}}alt="post Image"/></div> : <div></div>}
              
      </div>
      <div id="like-section" className="d-flex" style={{"cursor": "pointer", "marginLeft": "20px", "marginRight": "5px", "marginBottom": "0"}}>
      {islgin && data.raw_data.likes.includes(udata.raw_data._id) ?<div>
     <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a></div>:<div>
  <a id={"likebtn"+data.raw_data._id} onClick={() => {like(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", }}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg></a>  <a id={"unlikebtn"+data.raw_data._id} onClick={() => {unlike(data.raw_data._id, "reply")}} style={{"cursor": "pointer", "marginLeft": "3px", "marginRight": "5px", "display": "none"}}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg></a></div>
  }
  <p id={"likes_"+data.raw_data._id}>{data.processed_data.total_likes}</p>  <a href={"/"+"replies/"+data.raw_data._id}style={{"cursor": "pointer", "marginLeft": "6px",}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
  <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  </svg></a>
  <a onClick={( ()=> {share(data.raw_data._id, "replies")})} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" class="bi bi-share" viewBox="0 0 16 16">
  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
  </svg></a>
  {islgin && udata.raw_data.username === data.processed_data.username ? <><Link  to={"/"+"replies/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg></Link>
  <Link to={"/"+"replies/"+data.raw_data._id+"/manage"} style={{"cursor": "pointer", "marginLeft": "6px",  }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  </svg></Link> 
  </>
  
  
  : <></>}</div>
                   
      </div></>])
  }
  
}

if(type === "posts") {
    setThePost("post")
} else if(type === "questions") {
    setThePost("question")
} else if("replies") {
  setTheReply()
}


}, [type, id])

const buffer = (element, text) => {

    element.disabled = true 
    element.innerText = text || "Loading..."


}
const unbuffer = (element, text) => {

    element.disabled = false
    element.innerText = text 


}

const createReply = async() => {
const token = window.localStorage.getItem("token")
buffer(document.getElementById('replycreatebtn'), "Replying...")
let mentions = []
let topics= []
let file_url = null
const content = document.getElementById('reply-content').value 
const replyFile = document.getElementById('reply-file')

if(!content) {

  unbuffer(document.getElementById('replycreatebtn'), "Reply")
  return toast.error("Reply content is required!")
}

if(replyFile.files.length > 0) {
  const formData = new FormData()
  const file = replyFile.files[0]
  formData.append('attachment', file)
  const imrsp = await fetch(urls.cdn+"/upload", {
    method: "POST",
    body: formData
  })
  
  const data = await imrsp.json()
  if(data.success)  {
  file_url = data.url
  } else if(!data.success){
    unbuffer(document.getElementById('replycreatebtn'), "Reply")
    return toast.error("Unexpected error occured  on our end, please try again!")
    
  }
}

let r = content.split(' ')

  for(const content of r)  {
    if(content.startsWith("#")) topics.push(content.replace('#', ''));
    else if(content.startsWith("@")) mentions.push(content.replace('@', ''))
  }

  const sendReplyRequest = await fetch(urls.backend+"/api/create/reply",{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      replied_to: id,
      content: content,
      topics: topics,
      mentions: mentions,
      attachment_url: file_url
    })
  })

  const getReplyStatus = await sendReplyRequest.json()
  if(getReplyStatus.success) {
    document.getElementById('reply-content').value = ""
    document.getElementById('reply-file').value=""
    unbuffer(document.getElementById('replycreatebtn'), "Reply")
    return toast.success("Successfully added reply!")

  } else {
    unbuffer(document.getElementById('replycreatebtn'), "Reply")
    return toast.error(getReplyStatus.message)
  }
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

if(type === "posts" || type === "questions" || type === "replies") {

return (<div>
 <ToastContainer/> 
 {islgin ? 
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
        </nav> : <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
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
        </nav>} 

        <div className="container">
      <div className="col-lg-8 offset-lg-2">
       {post}
    {rcount}
       {replies}
       <br/><br/><br/><br/><br/>
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

} else {
    return <p>Not Found</p>
}
}