import React, { useState } from "react";

import formStyles from "../styles/form.module.css";


function Todoform() {
  const [inputs, setInputs] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState('');
 
  const handleChange = (e) => {
    setName(e.target.value);
  };
  const handleChange1 = (e) => {
    setPassword(e.target.value);
  };
  

  

  const handleSubmit1 = (e) => {
    
    e.preventDefault();
    

    const newInputs = [
      { name: name, password: password},
      ...inputs,
    ];
    setInputs(newInputs);
    console.log(newInputs);
  };


  return (
    
    <div className={formStyles.box}>
      <p className={formStyles.h1}>Welcome back Komrade<br></br>
      Now get back to grinding THE BEETCH</p>
      <form onSubmit={handleSubmit1}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          name="text"
          className={formStyles.todoinput}
          onChange={handleChange}
        ></input>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          name="text"
          className={formStyles.todoinput}
          onChange={handleChange1}
        ></input>
      </form>
      
      <button className={formStyles.todobutton}> Signin </button>


         </div>
    
  );
}

export default Todoform;