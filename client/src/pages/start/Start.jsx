import { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./start.scss";
import Question from "./Question";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Start = () => {
  const navigate = useNavigate()
  
  return (

    <div className="start">
      <div className="questionCard">
        <Question/>
      </div>
    </div>
  )
  

}


export default Start;