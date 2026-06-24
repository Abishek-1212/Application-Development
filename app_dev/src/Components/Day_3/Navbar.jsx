import { Link } from "react-router-dom";

function Navbar(){
    return(
    <>
    <nav>
       <button><Link to="/">Home</Link></button>
        
       <button> <Link to="/Login">Login</Link></button>
       <button> <Link to="/About">About</Link></button>
       <button> <Link to="/Contact">Contact</Link></button>
    </nav>
    </>
    )

}
export default Navbar;