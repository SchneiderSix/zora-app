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
import { useQueryClient, useMutation } from "@tanstack/react-query";



const BtnSbmtFQ = () => {
  
  const navigate = useNavigate()
  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };
  const { currentUser } = useContext(AuthContext);
  function check(){
    makeRequest.get("/likes/check-first-questions/" + currentUser.id)
    .then((res) => {
      if (res.data === 3) return navigate("/")
    })
  }
  return (
    <>
      <button onClick={() =>check()}>Submit</button>
    </>
  )

}



export default BtnSbmtFQ