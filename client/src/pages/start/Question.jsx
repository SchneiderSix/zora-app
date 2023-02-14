import { useContext, useState, useCallback } from "react";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/post/Post";
import "./start.scss";
import "../../components/posts/posts.scss";
import { Link, useNavigate } from "react-router-dom";
import Questiondesc from "./Questiondesc"
import { AuthContext } from "../../context/authContext";
import axios from 'axios';

const Question = ({counter}) => {

  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/first-questions").then((res) => {
      return res.data
    })
  )

  const navigate = useNavigate()
  return (
    <> 
      <div className="question">
        {error ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Questiondesc post={post} key={post.id} />)
        }
      </div>
      <div className="nextbtn">
      <button onClick={() =>navigate("/")}> Submit </button>
      </div>
    </>

  )
  
  
}

export default Question;