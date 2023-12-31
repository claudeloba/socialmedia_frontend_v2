import "./rightbar.scss";
import { useEffect, useState, useContext } from "react";
import { makeRequest } from "../../api.js";
import { AuthContext } from "../../context/authContext.js";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <div key={user._id} className="user">
      <div className="userInfo">
        <img src={"/upload/" + user.profilePic} alt="" />
        <Link to={"/profile/" + user._id}>
          <span className="user_name">{user.username}</span>
        </Link>
      </div>
    </div>
  );
};

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const { currentUser, userUpdated } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await makeRequest.get("/users/all");
      setUsers(data);
    };

    fetchUsers();
  }, [userUpdated]);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {users.map((user) => (
            <UserCard key={user._id} user={user} currentUser={currentUser} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
