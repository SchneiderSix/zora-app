import "./search.scss"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from"../../components/post/Post"

const Search = () => {
  const text = window.location.href.split("/").pop();

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/search/" + text).then((res) => {
      return res.data;
    })
  );
  return (
    <div className="searchContainer">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />)
      }
    </div>
  )
}

export default Search