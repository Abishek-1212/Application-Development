import Home from "./Home";

function Login(){
    const name=prompt("Enter Your name")
    return(
        <>
        <Home names={name}/>
        </>
    )
}
export default Login;