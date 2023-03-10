import "./rightBar.scss";
import Friend from "../friends/Friends"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";



const RightBar = () => {

  const { currentUser } = useContext(AuthContext);
  const getMyFriends = async () => {
    const { data } = await makeRequest.get("/users/find/friends/" + currentUser.id);
    return data;
  };

  const { isLoading, error, data } = useQuery(["frs"], getMyFriends);

  //Recommended friends
  const getMyRecoFriends = async () => {
    const { data } = await makeRequest.get("/users/find/friends/reco/" + currentUser.id);
    return data;
  };

  const { loading: load, error: err, data: dat } = useQuery(["recofrs"], getMyRecoFriends);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="menu">
          <p>Recommended Users</p>
          {err
          ? "Something went wrong!"
          : load
          ? "loading"
          : dat ? Object.entries(dat).map(([ky, val]) => {
            return <Friend friend={val}/>
        }): ""}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
