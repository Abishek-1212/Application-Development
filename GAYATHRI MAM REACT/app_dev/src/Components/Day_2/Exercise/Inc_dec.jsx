import { useState } from "react";
import "./color.css";
function Inc_dec(){
    const[number,setNumber]=useState(0);
    function increment(){
        setNumber(number+1);

    }
    function decrement(){
        setNumber(number-1);
    }
    return(
        <>
        <div className="card">
            <p>{number}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
        </>
    )
}
export default Inc_dec;