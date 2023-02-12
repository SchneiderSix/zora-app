import "./search.scss"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";


const Search = () => {
  const text = window.location.href.split("/").pop();

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/search/" + text).then((res) => {
      return res.data;
    })
  );
  return (
    <div className="searchContainer">
      
    </div>
  )
}

export default Search