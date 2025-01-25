import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./ResetPassword.css"; // Link to the ResetPassword CSS

const ResetPassword = () => {
  const [newpassword, setNewPassword] = useState("");
  const [conpass, setConPass] = useState("");

  const { id } = useParams();

  const notifyError = (err) => toast.error(err);
  const notifySuccess = (msg) => toast.success(msg);

  const navigate = useNavigate();

  const handlePassword = async () => {
    if (newpassword !== conpass) return notifyError("Passwords do not match");
    if(newpassword.length<=3) return notifyError('Password length is small')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/auth/resetpassword/${id}`,
        { newpassword }
      );
      if (response.data.message) {
        notifySuccess(response.data.message);
        localStorage.clear();
        navigate("/login");
      } else {
        notifyError(response.data.error);
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <div className="reset-password-form">
          <div className="form-group">
            <input
              type="password"
              placeholder="Change password"
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm password"
              value={conpass}
              onChange={(e) => setConPass(e.target.value)}
            />
          </div>
          <button className="submit-btn" onClick={handlePassword}>
            Set password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
