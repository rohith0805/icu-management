import React from "react";

function BedCard({bed}){

  return(
    <div style={{
      border:"1px solid gray",
      padding:"15px",
      margin:"10px",
      borderRadius:"8px"
    }}>

      <h3>{bed.hospital}</h3>

      <p>Available ICU Beds: {bed.beds}</p>

      {bed.beds > 0 ? (
        <span style={{color:"green"}}>Beds Available</span>
      ) : (
        <span style={{color:"red"}}>No Beds Available</span>
      )}

    </div>
  )

}

export default BedCard