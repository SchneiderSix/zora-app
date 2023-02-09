import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./start.scss";
import Question from "./Question";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Start = () => {
  var i = 0
  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };

  return (

    <div className="start">
      <div className="questionCard">
        <Question counter={i}/>
        <div className="nextbtn">
          <button onClick={() => next()}> Next </button>
        </div>
      </div>
      
    </div>
  )
  function next() {
    i++
    console.log(i)

  }

}


export default Start;