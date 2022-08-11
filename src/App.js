import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feeds from "./loggedInHomePage"
import Home from "./Home"
import Redirector from "./functions/redirector"
import Login from "./login"
import Logout from "./logout";



function App() {

return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login /> }/>
    <Route path="/logout" element={<Logout /> }/>
    </Routes>
    </BrowserRouter>
)


}

export default App



