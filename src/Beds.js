import React, { useState, useEffect } from "react";
import BedCard from "./BedCard";

function Beds(){

  const [beds,setBeds] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    // Fake API data
    const data = [
      {id:1, hospital:"City Hospital", beds:3},
      {id:2, hospital:"Apollo Clinic", beds:0},
      {id:3, hospital:"Red Cross Hospital", beds:5}
    ]

    setTimeout(()=>{
      setBeds(data)
      setLoading(false)
    },1000)

  },[])

  if(loading){
    return <h2>Loading ICU Beds...</h2>
  }

  return(
    <div style={{padding:"30px"}}>

      <h2>ICU Bed Availability</h2>

      {beds.map((bed)=>(
        <BedCard key={bed.id} bed={bed}/>
      ))}

    </div>
  )
}

export default Beds