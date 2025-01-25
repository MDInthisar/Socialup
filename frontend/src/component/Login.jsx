import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css'; // Import the CSS file

// isLoggedin context
import { LoggedInContext } from '../context/LoggedInContext';


const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const {setisLoggedIn} = useContext(LoggedInContext)
  
  const notifyerror = (err) => toast.error(err);
  const notifysuccess = (msg) => toast.success(msg);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password };    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_CONNECTION}/auth/login`, loginData, {withCredentials:true});
      
      if (response.data.error) {
        return notifyerror(response.data.error);
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      notifysuccess(response.data.message);
      setisLoggedIn(true)
      navigate('/'); // Navigate to the Home after successful login
    } catch (error) {
      console.error(error);
      notifyerror('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login">
          <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <div className="signup-link">
        <Link to="/signup">Don't have an account? Create one</Link>
      </div>
      <div className="signup-link">
        <Link to="/forgotpassword">Forgot password</Link>
      </div>
    </div>
    </div>

  );
};

export default Login;
