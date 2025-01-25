import React, { useState } from 'react';
import './EditProfile.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditProfile = ({setEdit}) => {
  const [username, setusername] = useState('');
  const [bio, setbio] = useState('');

  const notifyerror = (err)=> toast.error(err)
  const notifysuccess = (msg)=> toast.success(msg);

  const handleEdit = async (e)=>{
    e.preventDefault()

    if(bio.length<3 || username.length<2) return notifyerror('minimum 3 charecters needed');

    const response = await axios.put(`${import.meta.env.VITE_BACKEND_CONNECTION}/user/editprofile`, {username,bio}, {withCredentials:true}); 
    
    if(response.data.message){
      notifysuccess(response.data.message)
      setEdit(false)
    }
    else{
      notifyerror(response.data.error)
    }
    
    
  }



  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleEdit}> 
      <h2>Edit Profile</h2>
        {/* Username Input */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your new username"
            onChange={(e)=>setusername(e.target.value)}
          />
        </div>

        {/* Bio Input */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell us something about yourself"
            rows="4"
            onChange={(e)=> setbio(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-save">Save</button>
          <button type="button" className="btn-cancel" onClick={()=>setEdit(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
