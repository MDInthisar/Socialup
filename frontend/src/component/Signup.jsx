import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS file
import {GoogleLogin} from "@react-oauth/google"
import {jwtDecode} from 'jwt-decode'
import { LoggedInContext } from "../context/LoggedInContext";

const Signup = () => {
  const [fullname, setfullname] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  
  const {setisLoggedIn} = useContext(LoggedInContext);

  const notifyerror = (err) => toast.error(err);
  const notifysuccess = (msg) => toast.success(msg);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.{8,})(?=.*[0-9]?).+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;

    if (!emailRegex.test(email)) {
      return notifyerror("Invalid email");
    }

    if (!passwordRegex.test(password)) {
        return notifyerror(
          "At least 6 characters long.<br />At least one lowercase letter.<br />At least one uppercase letter.<br />At least one number.<br />At least one special character (e.g., !@#$%^&*)."
        );
      }
      

    if (password != confirmPassword) {
      return notifyerror("Password donst match");
    }

    const userData = { fullname, username, email, password };
    try {
      console.log(import.meta.env.VITE_BACKEND_CONNECTION);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/auth/signup`,
        userData
      );
      if (response.data.error) {
        return notifyerror(response.data.error);
      }

      notifysuccess(response.data.message);
      navigate("/login");
    } catch (error) {
      notifyerror("Something went wrong. Please try again later.");
    }
  };

  const handleGoogleLogin = async (credentialResponse, decode)=>{  
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_CONNECTION}/auth/googlelogin`, {
        name: decode.name,
        email: decode.email,
        email_verified: decode.email_verified,
        picture: decode.picture,
        clientID: credentialResponse.credential
      }, {withCredentials: true})
      if(response.data.token){
        localStorage.setItem('token', JSON.stringify(response.data.token))
        localStorage.setItem('user', JSON.stringify(response.data.user))
        notifysuccess('Login successfull');
        setisLoggedIn(true)
        navigate('/')
      }else{
        notifyerror('something went wrong')
      }
    }catch(error){
      notifyerror(error)
    }
    
  }

  return (
    <div className="signup">
          <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">
          Create Account
        </button>
      </form>
      <div className="login-link">
        <Link to="/login">Already have an account? Login</Link>
      </div>

      <GoogleLogin onSuccess={(credentialResponse)=>{
        const decode = jwtDecode(credentialResponse.credential)
        handleGoogleLogin(credentialResponse, decode)
        
      }} onError={()=>{
        notifyerror('credentialResponse error')
      }}  />
    </div>
    </div>

  );
};

export default Signup;
