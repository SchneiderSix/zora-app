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
    /*working in cosine*/
    /*Get feed to don't recommend post from current feed*/
    var currFeedId = [];
    makeRequest.get(`/posts/feed/${currentUser.id}`).then((res) => {
      for (let i  in res.data) {
        currFeedId.push(res.data[i].id);
      };
      /*console.log(currFeedId);*/
      /*Size === 0 error*/
      const sameArray = [];
      const descOb = {};
      console.log(post.desc);
      /*Get users that liked the same post*/
      makeRequest.get(`likes/${currentUser.id}/${post.id}`).then((response) => {
        /*console.log(response.data);*/
        for (let i in response.data) {
          /*console.log("UserID: " + response.data[i]["id"] + " PostID: " + post.id);*/
          /*Save 5 userIds into array*/
          sameArray.push(response.data[i]["id"]);};
        for (let i of sameArray) {
          /*Get last 3 posts of every user*/
          makeRequest.get(`likes/related/${i}/${post.id}`).then((res) => {
            /*console.log(res);*/
            for (var j = 0; j < Object.keys(res.data).length; j++) {
              if (res.data[j]["desc"] && !(descOb["postId"]) && !(currFeedId.includes(res.data[j]["postId"]))) {
                /*Save postId-dec into ob*/
                descOb[res.data[j]["postId"]] = res.data[j]["desc"];
              };
            };
            /*if (j  === Object.keys(res.data).length) console.log("Last Number of sameArr: " +sameArray.at(-1) + "  Current iterator: " + i);
            if (i === sameArray.at(-1)) console.log("This is -1 Current iterator: " + j +" Len res.data: "+Object.keys(res.data).length);*/
            /*Last iteration*/
            if ((i === sameArray.at(-1)) && (j  === Object.keys(res.data).length)) {
              /*console.log(descOb);*/
              console.log("Cosine:");
              if (Object.keys(descOb).length) {
                const cs = cosine(post.desc, Object.values(descOb));
                if (cs) {
                  console.log("PostId: " + Object.keys(descOb).find(key => descOb[key] === cs) + " PostDesc: " + cs);
                  /*Put post id into recommendedPostIds*/
                  try {makeRequest.put(`users/reco/post/${currentUser.id}/${Object.keys(descOb).find(key => descOb[key] === cs)}`)} catch (e) {};
                };
              };
            };
          });
        };
      });
    });
  };
  const handleNo = () => {
    decision = 0
    mutation.mutate(data.includes(currentUser.id));
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
          </div>
        </div>
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
            )}Yes
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
            )}No
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
