import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

import { useState } from "react";
import { makeRequest } from "../../axios";
import {useNavigate} from 'react-router-dom';


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [cu, setcu] = useState(currentUser);

  const [searchInput, setSearchInput] = useState('');
  const navi = useNavigate();

  const searchItems = () => {
    makeRequest.get("/users/find/name/" + searchInput)
    .then(res=> navi("/profile/" + res.data.id))
    .then(()=> window.location.reload(false))
    .catch(err=> console.log("User Not Found: " + err));
  }

  const reRender = () => {
    // calling the forceUpdate() method
    this.forceUpdate();
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span style={darkMode ? ({ color: "rgb(110, 199, 157)" }) : ({ color: "black" })}>Zora</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <input type="text" placeholder="Search Users..." onChange={(e) => setSearchInput(e.target.value)}></input>
          <button onClick={ () => searchItems()}><SearchOutlinedIcon /></button>
        </div>
      </div>
      <div className="right">
      <Link style={darkMode ? ({ color: "white" }) : ({ color: "black" })} onClick={() => navi("/profile/" + currentUser.id).then(()=> reRender())}>
          <PersonOutlinedIcon />
        </Link>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img
            src={"/upload/" + currentUser.profilePic + '?' + new Date()}
            alt={"" + currentUser.profilePic}
          />
          <span>{currentUser.name}</span>
          <Link to="/login" style={darkMode ? ({ color: "white", textDecoration: "none" }) : ({ color: "black", textDecoration: "none" })}>
          <span>Logout</span>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
