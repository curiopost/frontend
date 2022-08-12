import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feeds from "./loggedInHomePage"
import Home from "./Home"
import Redirector from "./functions/redirector"
import Login from "./login"
import Logout from "./logout";
import Register from "./Register"



function App() {

return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login /> }/>
    <Route path="/logout" element={<Logout /> }/>
    <Route path="/register" element={<Register/>}/>
    </Routes>
    </BrowserRouter>
)


}

export default App



