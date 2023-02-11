import { useContext, useState, useCallback } from "react";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/post/Post";
import "./start.scss";
import "../../components/posts/posts.scss";
import { Link, useNavigate } from "react-router-dom";
import Questiondesc from "./Questiondesc"

const Question = ({counter}) => {

  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/first-questions").then((res) => {
      return res.data
    })
  )

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
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
      <button > Next </button>
      </div>
        
    </>

  )
  
  
}

export default Question;