import React, { useEffect, useState } from "react";
import { FaEdit, FaUser, FaUserMinus } from "react-icons/fa";
import "./UserProfile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditProfile from "./EditProfile";

const UserProfile = () => {
  const [userdata, setuserdata] = useState("");
  const [userPosts, setuserposts] = useState([]);

  const [Edit, setEdit] = useState(false)

  const [isfollow, setisfollow] = useState(false);

  const { id } = useParams();

  const notifyfollow = (msg)=>toast.success(msg)
  const notifyUnfollow = (msg)=>toast.success(msg)


  useEffect(() => {
    const userPosts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/user/getprofile/${id}`,
        {
          withCredentials: true,
        }
      );
      setuserdata(response.data.user);
      setuserposts(response.data.post);
    };
    
    userPosts();
  },[<UserProfile/>]);

  // follow unfollow API
  const followUnfollow = async (userID) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_CONNECTION}/user/followandunfollow/${userID}`, {}, 
      { withCredentials: true }
    );

    if(response.data.userdata.followers.includes(JSON.parse(localStorage.getItem('user'))._id)){
      notifyfollow(response.data.message)
      setisfollow(false)
      return
    }else{
      notifyUnfollow (response.data.message)
      setisfollow(true)
    }
    
  }

  const toggleEdit =()=>{
    if(Edit){
      setEdit(false)
    }else{
      setEdit(true)
    }
  }
  

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-photo">
          <img
          src={ userdata.profileImage? userdata.profileImage  : "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-info" style={{position: 'relative'}}>
          <h2>{userdata.username}</h2>
          <div className="stats">
            <span>
              <strong>{userPosts.length}</strong> Posts
            </span>
            <span>
              <strong>{userdata.followers ? userdata.followers.length : 0}</strong> Followers
            </span>
            <span>
              <strong>{userdata.following ? userdata.following.length : 0}</strong> Following
            </span>
          </div>
          <p className="bio">
            {userdata.bio? userdata.bio : 'Bio empty'}
          </p>
          {
            JSON.parse(localStorage.getItem('user'))._id === userdata._id ?(
              <button className="edit-profile-btn" onClick={()=> toggleEdit()} >
              <FaEdit /> Edit Profile
            </button>
            ) : (
              null
            )
          }
          {userdata._id !== JSON.parse(localStorage.getItem("user"))._id ? (
            <div >
              {isfollow ? (
                <button
                  className="edit-profile-btn"
                  onClick={() => followUnfollow(userdata._id)}
                >
                  <FaUserMinus /> unfollow
                </button>
              ) : (
                <button
                  className="edit-profile-btn"
                  onClick={() => followUnfollow(userdata._id)}
                >
                  <FaUser /> follow
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        <h3>Posts</h3>
        <div className="posts-grid">
          {userPosts.length === 0 ? (
            <h1>No posts</h1>
          ) : (
            userPosts
              .slice()
              .reverse()
              .map((post) => (
                <div className="post" key={post._id}>
                  <img src={post.postimage} />
                </div>
              ))
          )}
        </div>
      </div>
      {Edit && <EditProfile setEdit={setEdit}/>}
    </div>
  );
};

export default UserProfile;
