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
        <div className="question">
          <Question/>
        </div>
        <div className="nextbtn">
          <button onClick={console.log(questionCounter)}> Next </button>
        </div>
      </div>
    </div>
  )
}


export default Start;