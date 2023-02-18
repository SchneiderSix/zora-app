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
    const { currentUser } = useContext(AuthContext);
    const { isLoading, error, data } = useQuery(["likes"], () =>
    makeRequest.get("/likes/check-first-questions/" + currentUser.id).then((res) => {
      return res.data
    })
    )
    return (
        <button onClick={() =>check()}> Submit </button>
    )


    function check() {
        error ? console.log(error) : isLoading ? console.log(isLoading) :
        navigate("/")
    }
}



export default BtnSbmtFQ