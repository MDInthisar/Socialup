import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaComment, FaShare } from "react-icons/fa"; // You can use react-icons for icons
import "./Home.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "./Spinner";
// import { LoggedInContext } from "../context/LoggedInContext";

const Home = () => {
  const [posts, setposts] = useState([]);
  const [comment, setcomment] = useState("");
  const [commentShow, setcommentShow] = useState(false);
  const [showItem, setshowItem] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const navigate = useNavigate();
  const notifyerror = (err) => toast.error(err);
  const notifysuccess = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      notifyerror("Please Login");
      navigate("/login");
    }

    const allposts = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_CONNECTION}/post/allposts`, {
        withCredentials: true,
      });
      setposts(response.data);
      setisLoading(false);
    };
    allposts();
  }, [<Home/>]);

  const togglecomment = (post) => {
    if (commentShow) {
      setcommentShow(false);
    } else {
      setcommentShow(true);
      setshowItem(post);
    }
  };

  const likeAndUnlikePost = async (postID) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/post/likeandunlikepost`,
        { postID },
        { withCredentials: true }
      );

      // Update the posts array with the new likes for the specific post
      const updatedPosts = posts.map((post) => {
        if (post._id === postID) {
          return { ...post, likes: response.data.likes }; // Update the post's likes
        }
        return post; // Keep other posts unchanged
      });

      setposts(updatedPosts); // Set the updated posts
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const postComment = async (comment, postID) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_CONNECTION}/post/comment`,
      { comment, postID },
      { withCredentials: true }
    );
    if (response.data.error) {
      notifyerror(response.data.error);
      setcomment("");
    } else {

      notifysuccess("comment successfull");
      const updatedPosts = posts.map((post) => {
        if (post._id === postID) {
          return {
            ...post,
            comments: {
              comment: response.data.comments.comment,
              commentedBy: response.data.comments.commentedBy,
            },
          };
        } else {
          return post;
        }
      });
      setshowItem(updatedPosts);
      setshowItem(true)
      setcomment("");
    }
  };

  const deletePost = async (postID) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_CONNECTION}/post/delete/${postID}`,
      { withCredentials: true }
    );
    notifysuccess(response.data.message);
  };

  return (
    <>
    { isLoading? <h1><Spinner/>  </h1> : (      <div className="home">
        {posts.length === 0 ? (
          <h1>No posts yet</h1>
        ) : (
          posts
            .slice()
            .reverse()
            .map((post) => (
              <div className="post-card" key={post._id}>
                {/* Header with profile image and username */}
                <div className="post-header">
                  <img
                    src={
                      post.postedBy.profileImage
                        ? post.postedBy.profileImage
                        : "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"
                    }
                    alt="Profile"
                    className="profile-pic"
                  />
                  <Link to={`/profilee/${post.postedBy._id}`}>
                    <span className="username">{post.postedBy.username}</span>
                  </Link>
                </div>

                {/* Post image */}
                <div className="post-image">
                  <img src={post.postimage} alt="Post" />
                </div>

                {/* Actions (Like, Comment, Share) */}
                <div className="post-actions">
                  <div className="action-icons">
                    {post.likes.includes(
                      JSON.parse(localStorage.getItem("user"))._id
                    ) ? (
                      <span
                        onClick={() => likeAndUnlikePost(post._id)}
                        style={{ cursor: "pointer" }}
                      >
                        ❤️
                      </span>
                    ) : (
                      <FaHeart
                        className="like-icon"
                        onClick={() => likeAndUnlikePost(post._id)}
                      />
                    )}
                    <FaComment className="comment-icon" />
                    <FaShare className="share-icon" />
                  </div>
                  <span className="like-count">{post.likes.length}</span>
                </div>

                {/* View comments */}
                <div className="view-comments">
                  <span
                    className="view-text"
                    onClick={() => togglecomment(post)}
                  >
                    View comments
                  </span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>

                <div className="caption">
                  <span>{post.caption}</span>
                </div>

                {/* Comment input and post button */}
                <div className="comment-section">
                  <input
                    onChange={(e) => setcomment(e.target.value)}
                    value={comment}
                    type="text"
                    placeholder="Add a comment..."
                    className="comment-input"
                  />
                  <button
                    className="post-comment-btn"
                    onClick={() => postComment(comment, post._id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            ))
        )}

        {/* show comments */}
        {/* show comments */}
        {commentShow && (
          <div className="showcomments" onClick={() => setcommentShow(false)}>
            <div className="container" style={{ position: "relative" }}>
              <div className="postpic">
                <img src={showItem.postimage} alt="" />
              </div>
              <div className="postcomment">
                <div className="post-header">
                  <img
                    src={showItem.postedBy.profileImage}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <span className="username">{showItem.postedBy.username}</span>
                  {showItem.postedBy._id ===
                  JSON.parse(localStorage.getItem("user"))._id ? (
                    <span
                      style={{
                        position: "absolute",
                        right: "5%",
                        cursor: "pointer",
                      }}
                      onClick={() => deletePost(showItem._id)}
                    >
                      🗑️
                    </span>
                  ) : null}
                </div>
                <hr />
                <div className="commentSection">
                  {showItem.comments
                    .slice()
                    .reverse()
                    .map((comment) => (
                      <div className="com">
                        <h3>{comment.commentedBy}</h3>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                </div>
                <hr />
                <span className="like-count">
                  {showItem.likes.length} likes
                </span>
                <div
                  className="caption"
                  style={{ marginTop: "1vw", paddingLeft: "0vw" }}
                >
                  <span>caption : {showItem.caption}</span>
                </div>
                <div className="commentinput">
                  <input
                    type="text"
                    placeholder="comment"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setcomment(e.target.value)}
                    value={comment}
                  />
                  <button onClick={() => postComment(comment, showItem._id)}>
                    post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>)}
    </>
  );
};

export default Home;
