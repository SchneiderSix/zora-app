import { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./start.scss";
import Question from "./Question";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Start = () => {
  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };
  const navigate = useNavigate()
  
  return (

    <div className="start">
      <div className="questionCard">
        <Question counter={0}/>
      </div>
    </div>
  )
  

}


export default Start;