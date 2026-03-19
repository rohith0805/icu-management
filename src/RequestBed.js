import React, { useState } from "react";

function RequestBed(){

  const [name,setName] = useState("");
  const [hospital,setHospital] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault()

    setMessage("Request Submitted Successfully!")

    setName("")
    setHospital("")
  }

  return(

    <div style={{padding:"30px"}}>

      <h2>Request ICU Bed</h2>

      <form onSubmit={handleSubmit}>

        <input
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required
        />

        <br/><br/>

        <input
        type="text"
        placeholder="Preferred Hospital"
        value={hospital}
        onChange={(e)=>setHospital(e.target.value)}
        required
        />

        <br/><br/>

        <button type="submit">Submit Request</button>

      </form>

      {message && <h3 style={{color:"green"}}>{message}</h3>}

    </div>
  )
}

export default RequestBed