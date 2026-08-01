import { useState } from "react";

function Home() {
  const [name, setName] = useState(prompt("Enter your name:"));

  const changeName = () => {
    const newName = prompt("Enter your new name:");
    if (newName !== null) {
      setName(newName);
    }
  };
  return (
    <>
      <h1>Hi {name}</h1>
      <button onClick={changeName}>Change</button>
    </>
  );
}
export default Home;