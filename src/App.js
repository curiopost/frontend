import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"
import Login from "./login"
import Logout from "./logout";
import Register from "./Register"
import Verify from "./verify"
import Search from "./search"
import Topics from "./topics"
import Notifications from "./notifications";
import Account from "./account";
import Profile from "./profilePage"
import ViewPost from "./viewPost"
import Manage from "./manage"
import Terms from "./terms"
import Privacy from "./privacy"
import NotFound from "./NotFound";



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
    <Route path="/topics/:topic" element={<Topics/>}/>
    <Route path="/notifications" element={<Notifications/>}/>
    <Route path="/account" element={<Account/>}/>
    <Route path="/u/:username" element={<Profile/>}/>
    <Route path="/:type/:id" element={<ViewPost/>}/>
    <Route path="/:type/:id/manage" element={<Manage/>}/>
    <Route path="/terms" element={<Terms/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="*" element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
)


}

export default App



