import "./stats.scss"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export const MySts = ({data}) => (
<div >
  <pre>
    <br></br>
    <p>language: {JSON.stringify(data["language"])}</p>
    <p>spell_check: {JSON.stringify(data["spell_check"])}</p>
    <p>root_words: {JSON.stringify(data["root_words"])}</p>
    <p>about_who: {JSON.stringify(data["about_who"])}</p>
    <p>insults: {JSON.stringify(data["insults"])}</p>
    <p>sentiment: {JSON.stringify(data["sentiment"])}</p>
  </pre>
  </div>);

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
    <div>
      <span>Stats</span>
      {err
      ? "Something went wrong!"
      : load
      ? "loading"
      : dat ? Object.entries(dat).map(([ky, val]) => {
        console.log(dat);
        return (
          <MySts data={val}/>
        )
    }): ""}
    </div>
  )
}

export default Stats