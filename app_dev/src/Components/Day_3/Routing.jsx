import { BrowserRouter, Routes,Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import About from "./About";
import Contact from "./Contact";
import Navbar from "./Navbar";

function Routing(){
    return(
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route path="/"element={<Home/>}/>
        <Route path="/Login"element={<Login/>}/>
        <Route path="/About"element={<About/>}/>
        <Route path="/Contact"element={<Contact/>}/>
    </Routes>

    </BrowserRouter>
    </>
    )
}
export default Routing;