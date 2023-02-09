import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Question = () => {
  
  const questions = undefined

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
      : data
      }
    </div>
  )

}

export default Question;