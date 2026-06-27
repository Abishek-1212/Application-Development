import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
function Forms(){
    const[name,setName]=useState("");
    const[passwords,setPasswords]=useState("");
    const[submitedname,setSubmitedname]=useState("");
    const[submitedpasswords,setSubmitedpasswords]=useState("");

    const HandleInput=(e)=>  
    {
        e.preventDefault();
        setSubmitedname(name);
        setSubmitedpasswords(passwords);
        console.log(name);
        console.log(passwords);
    }
    
    return(
        <>
        <center>
        <header>
            <h1>Login Page</h1>
            <br></br>
        </header>
        <div>
            <form onSubmit={HandleInput}>
               <input type="text" placeholder="Enter the Name" onChange={e=>setName(e.target.value)} ></input><br></br><br></br>
               <input type="password" placeholder="Enter the Password" onChange={e=>setPasswords(e.target.value)} ></input><br></br><br></br>
               <button type="submit" className="btn btn-primary"  >Login</button><br></br>
               <p>
                {submitedname}
               </p>
               <p>
                {submitedpasswords}
               </p>
               
               
            </form>
        </div>
         </center>
        </>
    )
}
export default Forms;
