import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./start.scss";
import Question from "./Question";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Start = () => {
  var questionCounter = 0;
  return (
    <div className="start">
      <div className="questionCard">
        <Question/>
        <button onClick={console.log(questionCounter)}> Next </button>
      </div>
    </div>
  )
}


export default Start;