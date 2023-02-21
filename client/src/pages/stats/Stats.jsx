import "./stats.scss"
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export const MySts = ({data}) => {
  const [cd, setCd] = useState(null);
  useEffect(() => {
    async function lanCode() {
        var languageNames = new Intl.DisplayNames(['en'], {
          type: 'language'
        });
        var cdJ = JSON.stringify(data["language"]);
        var strL =await languageNames.of(`${cdJ.substring(1, cdJ.length-1)}`);
        setCd(strL);
  }
  lanCode();
}, [data]);
  return (
  <div className="allStats">
<div className="stat">
  <pre>
    <span><b>Stats</b></span>
    <p>Language: {cd === "root" ? "Non detected": cd}</p>
    <p>Spell check: {JSON.stringify(data["spell_check"]) !== "Only for English" ?  JSON.stringify(data["spell_check"]).substring(1, JSON.stringify(data["spell_check"]).length - 1).replaceAll(",", ", ") : "Only for English" }</p>
    <p>Root words: {JSON.stringify(data["root_words"]).length !== 2 ? JSON.stringify(data["root_words"]).substring(1, JSON.stringify(data["root_words"]).length - 1).replaceAll(",", ", ") : "No root words"}</p>
    <p>About who: {JSON.stringify(data["about_who"]).length !== 2 ? JSON.stringify(data["about_who"]) : "No one"}</p>
    <p>Insults counter: {JSON.stringify(data["insults"])}</p>
    <p>Sentiment: {JSON.stringify(data["sentiment"]) !== "null" ? JSON.stringify(data["sentiment"]) : "Non detected" }</p>
  </pre>
  </div></div>)
};

const Stats = () => {
  const { currentUser } = useContext(AuthContext);

   //Get stats for user
   const getMyStats = async () => {
    const  res  = await makeRequest.get(`/posts/last/${currentUser.id}`);
    let dict = {};
    for (let i of Object.values(res.data)) {
      dict[i["id"]] = i["desc"];
    }
    const {data} =  await makeRequest.post(`/users/complex`, dict);
    return data;
  };
  const { loading: load, error: err, data: dat } = useQuery(["sts"], getMyStats);

  return (
    <div className="pageStats">
      {err
      ? "Something went wrong!"
      : load
      ? "loading"
      : dat ? Object.entries(dat).map(([ky, val]) => {
        return (
          <MySts data={val}/>
        )
    }): ""}
    </div>
  )
}

export default Stats