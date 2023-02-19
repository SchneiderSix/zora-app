import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import Friend from "../friends/Friends"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  const getMyFriends = async () => {
    const { data } = await makeRequest.get("/users/find/friends/" + currentUser.id);
    return data;
  };

  const { isLoading, error, data } = useQuery(["frs"], getMyFriends);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>

          {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : Object.entries(data).map(([key, value]) => {
            return <Friend friend={value} key={value.id}/>
        })}

        </div>
      </div>
    </div>
  );
};

export default LeftBar;
