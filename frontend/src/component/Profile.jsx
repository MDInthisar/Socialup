import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaUber, FaUser } from "react-icons/fa";
import "./Profile.css";
import axios from "axios";
import ProfilePic from "./ProfilePic";
import { ProfileImageContext } from "../context/ProfileImageContext";
import EditProfile from "./EditProfile";
import SuggestionUser from "./SuggestionUser";

const Profile = () => {
  const { profileImage } = useContext(ProfileImageContext);
  const [myposts, setmyposts] = useState([]);
  const [user, setuser] = useState("");
  const [changeProfilePic, setchangeProfilePic] = useState(false);
  const [newUser, setnewUser] = useState(false);

  const [Edit, setEdit] = useState(false);

  useEffect(() => {
    const myposts = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_CONNECTION}/post/myposts`, {
        withCredentials: true,
      });
      setuser(response.data.user);
      setmyposts(response.data.post);
    };
    myposts();
  }, [<EditProfile/>]);

  const changeProfile = () => {
    setchangeProfilePic((prev) => !prev); // Toggle the modal
  };

  const toggleEdit = () => {
    if (Edit) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  const newSuggesstion = () => {
    if (newUser) {
      setnewUser(false);
    } else {
      setnewUser(true);
    }
  };

  return (
    <>
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header" style={{position:'relative'}}>
          <div className="profile-photo">
            <img
              onClick={changeProfile}
              src={
                user.profileImage ||
                "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"
              }
              alt="Profile"
              className="profile-img"
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <div className="stats">
              <span>
                <strong>{myposts.length}</strong> Posts
              </span>
              <span>
                <strong>{user.followers ? user.followers.length : 0}</strong>{" "}
                Followers
              </span>
              <span>
                <strong>{user.following ? user.following.length : 0}</strong>{" "}
                Following
              </span>
            </div>
            <p className="bio">{user.bio ? user.bio : "Empty .........."}</p>

            {JSON.parse(localStorage.getItem("user"))._id === user._id ? (
              <button className="edit-profile-btn" onClick={() => toggleEdit()}>
                <FaEdit /> Edit Profile
              </button>
            ) : null}

            <button className="edit-profile-btn" style={{position:'absolute', right:'0%', bottom:'9.5%'}} onClick={() => newSuggesstion()}>
              <FaUser/> {newUser? 'Hide suggestion' : 'Show suggestion'}
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h3>Posts</h3>
          <div className="posts-grid">
            {myposts.length === 0 ? (
              <h1>No posts</h1>
            ) : (
              myposts
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

        {/* Profile Picture Modal */}
        {changeProfilePic && (
          <ProfilePic setchangeProfilePic={setchangeProfilePic} />
        )}
        {Edit && <EditProfile setEdit={setEdit} />}
      </div>
      {newUser && <SuggestionUser />}
    </>
  );
};

export default Profile;
