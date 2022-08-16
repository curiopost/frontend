import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"
import Login from "./login"
import Logout from "./logout";
import Register from "./Register"
import Verify from "./verify"
import Search from "./search"



function App() {

return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login /> }/>
    <Route path="/logout" element={<Logout /> }/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/verify" element={<Verify/>}/>
    <Route path="/search" element={<Search/>}/>
    </Routes>
    </BrowserRouter>
)


}

export default App



