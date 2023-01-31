import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { selectUnstyledClasses } from "@mui/base";


const Post = ({ post }) => {
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
    this.forceUpdate();
  };
  const handleNo = () => {
    decision = 0
    mutation.mutate(data.includes(currentUser.id));
    this.forceUpdate();
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  /*click on post img*/
  const [isActive, setActive] = useState("false");

  const handleClickImg = () => {
    setActive(!isActive);
  };
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img className={isActive ? "deactived" : "active"} src={"/upload/" + post.img} alt=""  onClick={handleClickImg}/>
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
            )}
            {yes} Yes
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
            )}
            {no} No
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
