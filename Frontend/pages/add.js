
import React, { useState } from "react";
import axios from 'axios'

function add() {
   const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleChange1 = (e) => {
    setInput1(e.target.value);
  };
  const handleChange2 = (e) => {
    setInput2(e.target.value);
  };

    const handleSubmit1 = (e) => {
        e.preventDefault();
        const api = axios.create({
            baseURL: ""
            
        });
        api.post(`http://localhost:3000/article`, {
            title: input1,
            body:input2
        }
        )
        
//         fetch('http://localhost:3000/article', {
//             method: 'POST', // or 'PUT'
//             body: ({title: input1,
//                 body:input2
//             }),
           
// }
//           )
          
          .then(response => response.json())
          .then(body => {
            console.log('Success:', body);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

    }
    return (
        <div>
            THIS IS WHERE U ADD ARTICLES
        </div>,
        <div>
            <form>
                <input placeholder="Enter title" value={input1} onChange={handleChange1}></input>
                <input placeholder="Enter body" onChange={handleChange2} value={input2}></input>
                <button type="submit" onClick={handleSubmit1}>post</button>
                </form>
        </div>
    )
}

export default add
