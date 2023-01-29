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

import * as stringSimilarity from "string-similarity";

const Post = ({ post }) => {

  const cosine = (txt, arr) => {
    const matches = stringSimilarity.findBestMatch(txt, arr);
    console.log(matches["bestMatch"]["target"]);
  };

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
      return makeRequest.post("/likes", { postId: post.id });
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


  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
    /*working in cosine*/
    const sameArray = [];
    const descOb = {};
    console.log(post.desc);
    /*Get users that liked the same post*/
    makeRequest.get(`likes/${currentUser.id}/${post.id}`).then((response) => {
      console.log(response.data);
      for (let i in response.data) {
        console.log("UserID: " + response.data[i]["id"] + " PostID: " + post.id);
        /*Save userId into array*/
        sameArray.push(response.data[i]["id"]);};
      for (let i of sameArray) {
        /*Get last 3 posts of every user*/
        makeRequest.get(`likes/related/${i}/${post.id}`).then((res) => {
          console.log(res);
          for (var j = 0; j < Object.keys(res.data).length; j++) {
            if (res.data[j]["desc"] && !(descOb["postId"])) {
              /*Save postId-dec into ob*/
              descOb[res.data[j]["postId"]] = res.data[j]["desc"];
            };
          };
          if (j  === Object.keys(res.data).length) console.log("Last Number of sameArr: " +sameArray.at(-1) + "  Current iterator: " + i);
          if (i === sameArray.at(-1)) console.log("This is -1 Current iterator: " +j+" Len res.data: "+Object.keys(res.data).length);
          /*Last iteration*/
          if ((i === sameArray.at(-1)) && (j  === Object.keys(res.data).length)) {
            console.log(descOb);
            console.log("Cosine");
            cosine(post.desc, Object.values(descOb));
          };
        });
      };
    });
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
          <img className={isActive ? "desactived" : "active"} src={"/upload/" + post.img} alt=""  onClick={handleClickImg}/>
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={() => {handleLike();}}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
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
