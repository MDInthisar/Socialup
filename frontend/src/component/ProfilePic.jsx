import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { ProfileImageContext } from "../context/ProfileImageContext";
import { Navigate } from "react-router-dom";

const ProfilePic = ({ setchangeProfilePic }) => {
  const { setprofileImage } = useContext(ProfileImageContext);
  const [postimg, setpostimg] = useState(null); // Use null for the initial state
  const [url, seturl] = useState(""); // Store the uploaded image URL

  const handleInputFile = useRef(null); // Reference to the file input

  const notifyerror = (err) => toast.error(err);
  const notifysuccess = (msg) => toast.success(msg);

  // Trigger the file input click when the "Upload image" button is clicked
  const handleClick = () => {
    handleInputFile.current.click();
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setpostimg(file); // Set the file to state when selected
    }
  };

  // Upload the image to Cloudinary and get the URL
  const postDetails = async () => {
    if (!postimg) return;

    const data = new FormData();
    data.append("file", postimg);
    data.append("upload_preset", "socialUp");
    data.append("cloud_name", "inthicloud1");

    try {
      const cloudResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/inthicloud1/image/upload",
        data
      );

      if (cloudResponse.data.url) {
        setprofileImage(cloudResponse.data.url);
        seturl(cloudResponse.data.url); // Set the URL once uploaded
      } else {
        notifyerror("Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      notifyerror("Image upload failed");
    }
  };

  // Update the profile picture with the uploaded image URL
  const updateProfilePic = async () => {
    if (!url) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_CONNECTION}/user/profileimage`,
        { url }, // Send the URL to the backend
        { withCredentials: true }
      );
      if (response.data.message) {
        notifysuccess(response.data.message); // Show success notification
        setchangeProfilePic(false); // Close the modal after success
      } else {
        notifyerror(response.data.error || "Failed to update profile picture");
      }
    } catch (error) {
      console.error(error);
      notifyerror("Error updating profile picture");
    }
  };

  const removeProfileImage = async ()=>{

      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_CONNECTION}/user/removeprofile`, {withCredentials:true});
      notifysuccess(response.data.message);
      setchangeProfilePic(false)


  }

  // Effect to upload image when a file is selected
  useEffect(() => {
    if (postimg) {
      postDetails(); // Upload the image to Cloudinary
    }
  }, [postimg]);

  // Effect to update the profile once the URL is ready
  useEffect(() => {
    if (url) {
      updateProfilePic(); // Once URL is available, update the profile picture
    }
  }, [url]);

  return (
    <>
      <div className="logcontainer" onClick={() => setchangeProfilePic(false)}>
        <div className="logmodel" onClick={(e) => e.stopPropagation()}>
          <button className="btn-primary" onClick={handleClick}>
            Upload image
          </button>

          <input
            ref={handleInputFile}
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange} // Handle file selection
          />

          <button className="btn-primary" onClick={() => {
            removeProfileImage()
          }}>
            Remove image
          </button>

          <button
            className="btn-primary"
            onClick={() => setchangeProfilePic(false)} // Close the modal
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePic;
