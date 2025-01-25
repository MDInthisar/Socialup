import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import "./SuggestionUser.css";
import axios from "axios";
import { toast } from "react-toastify";

const SuggestionUser = () => {
  const [newUser, setnewUser] = useState([]);
  const [isFollow, setisFollow] = useState(false);

    const notifyfollow = (msg)=>toast.success(msg)
    const notifyUnfollow = (msg)=>toast.success(msg)
  
  useEffect(() => {
    const newSuggestion = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/user/suggestion`,
        { withCredentials: true }
      );
      setnewUser(response.data);
    };
    newSuggestion();
  }, []);

  const followUnfollow = async (userID)=>{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_CONNECTION}/user/followandunfollow/${userID}`,{},{withCredentials:true});

    if(response.data.userdata.followers.includes(JSON.parse(localStorage.getItem('user'))._id)){
      notifyfollow(response.data.message)
      setisFollow(false)
      return
    }else{
      notifyUnfollow (response.data.message)
      setisFollow(true)
    }
    
  }



  return (
    <>
      <div className="suggestion-list">
        {newUser.length === 0
          ? "No suggestion"
          : newUser.map((user) => (
              <div className="suggestion-card" key={user._id}>
                <div className="user-info">
                  {/* Profile Picture */}
                  <img
                    className="profile-pic"
                    src={user.profileImage ? user.profileImage : "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"}
                    alt="Profile"
                  />
                  {/* Username */}
                  <div className="username">{user.username}</div>
                  {/* Bio */}
                  {user.bio && <div className="bio">{user.bio}</div>}
                </div>

                {/* Follow Button */}
                {/* <button className="follow-btn" onClick={()=>followUnfollow(user._id) }>
                  <FaUserPlus /> {isFollow? 'unfollow' : 'follow'}
                </button> */}
                {
                  isFollow?(
                    <button className="follow-btn" onClick={()=>followUnfollow(user._id) }>
                    <FaUserPlus /> unfollow
                  </button>
                  ) : (
                    <button className="follow-btn" onClick={()=>followUnfollow(user._id) }>
                    <FaUserPlus /> follow
                  </button>
                  )
                }
              </div>
            ))}
      </div>
    </>
  );
};

export default SuggestionUser;
