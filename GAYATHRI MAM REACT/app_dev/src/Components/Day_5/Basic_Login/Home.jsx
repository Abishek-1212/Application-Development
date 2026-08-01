import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🏠 Home Page</h1>
      <p>Login Successful!</p>
      <br></br>
      <Link to="/login">
      <button style={{background:"black",color:"whitesmoke",width:"50px",height:"20px"}}>Logout</button>
      </Link>
      
    </div>
  );
}

export default Home;