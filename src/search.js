import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import urls from "./variables/urls"

export default function Search() {
    document.title = "Curiopost / Search"
    const [lgin, setLgin] = useState({})
    
    const [islgin, setIslgin] = useState(false)
    const [query, setQuery] = useState('')
    const [result, setResult] = useState([])
    const [message, setMessage] = useState('Enter a query to search.')

    useEffect(() => {
        const haslgin = async() => {
            const token = window.localStorage.getItem("token")
            if(!token) {
                setIslgin(false)
                setLgin({})

                return;
            }

            const fetchAccount= await fetch(urls.backend+"/api/auth/getuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                }
            })

            const data = await fetchAccount.json()
            if(data.success) {
                setIslgin(true)
                setLgin(data)

                return;
            } else if(!data.success) {
                setIslgin(false)
                setLgin({})

                return;
            }
        }

        haslgin()
    }, [])

    useEffect(() => {
       
        const search = async() => {

           

            setMessage("Loading...")

            const getresults = await fetch(urls.backend+`/api/read/search?q=${encodeURI(query)}`)
            
            const results = await getresults.json()
            if(results.success) {
                setResult([])

              
                

                results.users.forEach(u => {
                    setResult(result => [...result, <><Link  to={"/u/"+u.username}  className="text-decoration-none" style={{"marginBottom": "1%", "color": "inherit"}}>
                    <div className="card w-100" style={{"marginBottom": "1%"}}>
                     <div className="card-body">
                    
                      <Link to={"/u/"+u.username} className="text-decoration-none"><img src={u.avatar_url ? u.avatar_url : "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"} className="rounded float-start"  alt="logo" width="25" height="25" style={{marginRight: "5px"}}></img><h5 className="card-title text-muted">{u.name} (@{u.username})</h5></Link>   
                      <p>{u.bio}</p>
                     </div>
                     </div>
                     </Link>
                   
                </>])
                })
results.posts.forEach(p => {
    setResult(result => [...result, <><Link className="text-decoration-none" to={"/"+p.type.toLowerCase()+"s/"+p._id} style={{"marginBottom": "1%", "color": "inherit"}}>
    <div className="card w-100" style={{"marginBottom": "1%"}}>
    <div className="card-body">
    <p className="float-end text-muted">{p.created_date}</p>
    <Link to={"/u/"+p.username} className="text-decoration-none"><img src={p.avatar_url ? p.avatar_url: "https://res.cloudinary.com/curiopost/image/upload/v1660395029/media/logo_yawcsx.png"} className="rounded float-start" width="25" height="25" style={{marginRight: "5px"}}></img><h5 className="card-title text-muted">{p.name} (@{p.username})</h5></Link>   
    <h5 className="card-title">{p.title} <small>({p.type.toLowerCase()})</small></h5>
    <p>{p.content}</p>
    </div>
    </div>
    </Link>
</>])
})
                

                if(result.length === 0) {
                    setMessage("No Results Found.")
                } 


                
            } else {
                setMessage("No Results Found.")
                setResult([]) 
            }
        }
        if(query === '' || query === " " || query.length < 1) {
            setMessage('Enter a query to search.')
            setResult([])
            
            return;} else {
                search()
            }
      
    }, [query])
    return (<div>{islgin ? 
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
                  <Link className="nav-link" to={"/u/" + lgin.raw_data.username}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
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
                    <Link className="nav-link  active" to="/search">Search</Link> 
                    </li>
                    
                    

            </ul>
            
            
            </div>
            
        </div>
        </nav>}<div className="container">
        <div className="col-lg-6 offset-lg-3"  style={{"marginTop": "10%", }}>
            <div className="input-group mb-4 p-1">
                <input type="search" className="form-control" placeholder="Type Here to Search" onChange={(e) => {   setResult([]); setQuery(e.target.value)}}></input>
              
               </div>
           {result.length > 0 ? result : <p className="text-center">{message}</p>}
           
            </div>
        
            </div></div>)
}