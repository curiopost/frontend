import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feeds from "./loggedInHomePage"
import Home from "./Home"
import isLoggedIn from "./functions/isLoggedin";

export default function App() {

    const hasUserLoggedIn = isLoggedIn()


return(
    <BrowserRouter>
    <Routes>
    <Route path="/" element={hasUserLoggedIn.loggedIn ? <Feeds/>: <Home/>} />
    </Routes>
    </BrowserRouter>
)

}



