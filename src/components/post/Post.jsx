import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../api.js";
import { AuthContext } from "../../context/authContext";
import EditPost from "../editpost/EditPost";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const { isLoading, data } = useQuery(["likes", post._id], () =>
    makeRequest.get("/likes?postId=" + post._id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post._id);
      return makeRequest.post("/likes", { postId: post._id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser._id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post._id);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleFinishEdit = () => {
    setEditMode(false);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.userId.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.userId.username}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon
            className="dots"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && post.userId._id === currentUser._id && (
            <div className="buttons">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
        {editMode ? (
          <EditPost post={post} onFinishEdit={handleFinishEdit} />
        ) : (
          <>
            <div className="content">
              <p>{post.desc}</p>
              <img src={"/upload/" + post.img} alt="" />
            </div>
            <div className="info">
              <div
                role="button"
                tabIndex={0}
                className="item"
                onClick={handleLike}
                onKeyDown={(e) => {
                  if (e.code === "Enter" || e.code === "Space") {
                    setCommentOpen(!commentOpen);
                  }
                }}
              >
                {isLoading ? (
                  "loading"
                ) : data.includes(currentUser._id) ? (
                  <FavoriteOutlinedIcon style={{ color: "red" }} />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
                {data?.length} Likes
              </div>
              <div
                role="button"
                tabIndex={0}
                className="item"
                onClick={() => setCommentOpen(!commentOpen)}
                onKeyDown={(e) => {
                  if (e.code === "Enter" || e.code === "Space") {
                    setCommentOpen(!commentOpen);
                  }
                }}
              >
                <TextsmsOutlinedIcon />
                Comments
              </div>
            </div>
          </>
        )}
        {commentOpen && <Comments postId={post._id} />}
      </div>
    </div>
  );
};

export default Post;
