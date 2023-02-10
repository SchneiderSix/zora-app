import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/post/Post";
import "./start.scss";
import { Link } from "react-router-dom";

const Question = ({counter}) => {

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/first-questions").then((res) => {
      return res.data
    })
  )

  
  
  return (
      <div className="question">
        {error ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data[counter]['desc']
      }
      </div>
      
  )
  
  
}

export default Question;