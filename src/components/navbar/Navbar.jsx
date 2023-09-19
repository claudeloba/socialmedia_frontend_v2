import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../api.js";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="navbar">
      {error && <div className="error">Error: {error}</div>}
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logotyp">
            <HomeOutlinedIcon /> Nackademin Social Club
          </span>
        </Link>
      </div>
      <div className="right">
        {darkMode ? (
          <WbSunnyOutlinedIcon className="hovered" onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon className="hovered" onClick={toggle} />
        )}
        <div className="user">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <Link
            to={`/profile/${currentUser._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span>{currentUser.username}</span>
          </Link>
          <LogoutIcon className="hovered" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
