import React from "react";
import {Link} from "react-router-dom"
import "./home.css"

export default function About() {
    document.title = "Curiopost"

return (
    <div>
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
            <Link to="/" className="navbar-brand"><img src="/logo.png" alt="logo" width="30" height="30" className="d-inline-block align-text-top"/> Curiopost</Link>

            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-controls="#navbarNav"  aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="nav navbar-nav mr-auto">
            <li className="nav-item">
            <Link className="nav-link active" to="/">Home</Link> 
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link> 
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link> 
                    </li>
                    
                    

            </ul>
            
            
            </div>
            
        </div>
        </nav>

        <div className="container">
            <img src="/logo.png" className="rounded" style={{"marginTop": "15%", }} alt="logo" width="50" height="50"/>
            <h1 className="text-dark text-left" >The social media platform you didn't want, <br/>but what you needed... </h1>
            <p>Create posts, questions, share memes, opinions, find users and more, all in just one platform.</p>
  <Link to="/register" className="btn btn-outline-dark" style={{"marginBottom": "25%"}}>Create a free account</Link>

  
    <div className="row" style={{"marginTop": "0", "marginBottom": "20%"}}>
        <div className="col-sm-4"><h1><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-file-lock" viewBox="0 0 16 16">
  <path d="M8 5a1 1 0 0 1 1 1v1H7V6a1 1 0 0 1 1-1zm2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224zM6.105 8.125A.637.637 0 0 1 6.5 8h3a.64.64 0 0 1 .395.125c.085.068.105.133.105.175v2.4c0 .042-.02.107-.105.175A.637.637 0 0 1 9.5 11h-3a.637.637 0 0 1-.395-.125C6.02 10.807 6 10.742 6 10.7V8.3c0-.042.02-.107.105-.175z"/>
  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
</svg> Secure and reliable</h1>
        <p>Our service is very reliable, easy to use and with high grade security made so that you can focus on enjoying your experience here. Backed by high experienced employees.</p></div>
        <div className="col-sm-4"><h1><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
</svg> Privacy Friendly</h1>
        <p>Here at Curiopost we care a lot about your privacy. We always try to only collect data which is required by our service. And are always welcome for data removal requests if needed.</p></div>
        <div className="col-sm-4"><h1><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-graph-up" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
</svg> A great way to grow</h1>
        <p>Got any bussiness where you want to post announcements? Or just share about it? Curiopost is your go to solution for doing any of those kinds of things!</p></div>
    
    </div>
    <div className="mt-4 p-5 bg-dark text-white rounded" style={{"marginBottom": "20%"}}>
        <h1>Ready to try Curiopost?</h1>
        <p>Create posts, questions, share memes, opinions, find users and more, all in just one platform.</p>
        <Link to="/register" className="btn btn-outline-light">Create a free account</Link>
        </div>
        <footer className=" py-3 my-4 border-top ">
  
  <div className="row">
  <div className="col-sm-1">
<h5 className="text-muted">Socials</h5>
   <a href="https://twitter.com/curiopost" className="text-decoration-none " target={"_blank"}>Twitter</a><br/>
      <a href="https://github.com/curiopost" className="text-decoration-none" target={"_blank"}>GitHub</a><br/>
      <a href="https://www.youtube.com/channel/UCsA-SIwx157a3WqAC0wAOVA" className="text-decoration-none" target={"_blank"}>YouTube</a><br/>
      <a href="https://discord.gg/NzBQm9MfkE" className="text-decoration-none" target={"_blank"}>Discord</a>
  </div>
  <div className="col-sm-1">
<h5 className="text-muted">Contact</h5>
   <a href="mailto:curiopost.live@outlook.com" className="text-decoration-none" >Email</a><br/>
      
  </div>
  <div className="col-sm-1 ">
<h5 className="text-muted">Account</h5>
  <Link to="/register" className="text-decoration-none" >Register</Link><br/>
  <Link to="/login" className="text-decoration-none" >Login</Link><br/>
      
  </div>
  <div className="col-sm-1 ">
  <h5 className="text-muted">Legal</h5>
  <Link to="/privacy" className="text-decoration-none" >Privacy</Link><br/>
  <Link to="terms" className="text-decoration-none" >Terms</Link><br/>
  </div>
  <div className="col-sm-1 ">
  <h5 className="text-muted">Credits</h5>
  <a href="https://www.flaticon.com/" className="text-decoration-none" target={"_blank"}>Flaticon</a><br/>
    </div>
    <div className="col ">
    <p className="text-muted">Copyright &copy; {new Date().getFullYear()} Curiopost.</p>
    </div>
  </div>
 </footer>

        </div>
        
    </div>
)

}


