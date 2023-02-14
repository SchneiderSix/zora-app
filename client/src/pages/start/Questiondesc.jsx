import "../../components/posts/posts.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import * as stringSimilarity from "string-similarity";


const Post = ({ post }) => {
  const cosine = (txt, arr) => {
    const matches = stringSimilarity.findBestMatch(txt, arr);
    /*console.log(matches["bestMatch"]["target"]);*/
    return (matches["bestMatch"]["target"]);
  };
  var decision = null
  var chosen = null
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
  makeRequest.get("/likes?postId=" + post.id).then((res) => {
    return res.data;
  })
  );

  const queryClient = useQueryClient();



  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", {postId: post.id, decision: decision});
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
    );
    const deleteMutation = useMutation(
      (postId) => {
        return makeRequest.delete("/posts/" + postId);
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["posts"]);
        },
      }
      );
      let yes = 0
      let no = 0
      for (const i in data)
      {
        if (data[i].includes(currentUser.id)) chosen = data[i][1];
        if (data[i][1] == 1) yes++;
        else no++;
      }
      
  const handleYes = () => {
    decision = 1
    mutation.mutate(data.includes(currentUser.id));
  }
  const handleNo = () => {
    decision = 0
    mutation.mutate(data.includes(currentUser.id));
  };
  return (
    <div className="post">
      <div className="container">
        <div className="content">
          <p>{post.desc}</p>
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : chosen != null && chosen == 1 ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleYes}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
              onClick={handleYes}
              />
            )} Yes
          </div>
          <div className="item">
            {isLoading ? (
              "loading"
              ) : chosen != null && chosen == 0 ? (
              <FavoriteOutlinedIcon
                style={{ color: "blue" }}
                onClick={handleNo}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
              onClick={handleNo} 
              />
            )} No
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
