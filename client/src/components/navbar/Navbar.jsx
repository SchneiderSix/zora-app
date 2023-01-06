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


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState('');

  let nam = '';

  const searchItems = (/*searchValue*/) => {
    /*setSearchInput(searchValue);*/
    makeRequest.get("/users/find/name/" + nam)
    .then(res=> console.log(res.data))
    .catch(err=> console.log(err));
  }


  makeRequest.get("/users/find/name/test1")
    .then(res=> console.log(res.data))
    .catch(err=> console.log(err));

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Social Media App</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <input type="text" placeholder="Search..." onChange={(e) => nam = e.target.value}></input>
          <button onClick={ () => searchItems()}><SearchOutlinedIcon /></button>
        </div>
      </div>
      <div className="right">
      <Link to={"/profile/" + currentUser.id} style={darkMode ? ({ color: "white" }) : ({ color: "black" })}>
          <PersonOutlinedIcon />
        </Link>
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img
            src={"/upload/" + currentUser.profilePic}
            alt=""
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
