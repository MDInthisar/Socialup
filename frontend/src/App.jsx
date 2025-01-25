import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./component/Signup";

import { ToastContainer } from "react-toastify";
import Login from "./component/Login";
import Home from "./component/Home";
import Navbar from "./component/Navvbar";
import { LoggedInContext } from "./context/LoggedInContext";
import Profile from "./component/Profile";
import CreatePost from "./component/CreatePost";
import LogoutModel from "./component/LogoutModel";
import UserProfile from "./component/UserProfile";
import { ProfileImageContext } from "./context/ProfileImageContext";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [modelOpen, setmodelOpen] = useState(false);

  // set profile image
  const [profileImage, setprofileImage] = useState("");
  return (
    <>
      <BrowserRouter>
        <GoogleOAuthProvider clientId= {import.meta.env.VITE_GOOGLE_CLIENTID}>
          <LoggedInContext.Provider
            value={{ setisLoggedIn, isLoggedIn, setmodelOpen }}
          >
            <ProfileImageContext.Provider
              value={{ profileImage, setprofileImage }}
            >
              <ToastContainer theme="dark" />
              <Navbar checklogin={isLoggedIn} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route path="/createpost" element={<CreatePost />} />
                <Route path="/profilee/:id" element={<UserProfile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/resetpassword/:id" element={<ResetPassword />} />
              </Routes>
              {modelOpen && <LogoutModel setmodelOpen={setmodelOpen} />}
            </ProfileImageContext.Provider>
          </LoggedInContext.Provider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
