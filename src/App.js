import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feeds from "./loggedInHomePage"
import Home from "./Home"
import Redirector from "./functions/redirector"
import Login from "./login"



function App() {

return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/login" element={<Login /> }/>
    </Routes>
    </BrowserRouter>
)


}

export default App



