import React, { useEffect, useRef, useState } from "react";
import "./CreatePost.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {    

    const [caption, setcaption] = useState("");
    const [postimg, setpostimg] = useState("");
    const [url, seturl] = useState("");

    const [user, setuser] = useState("");
    
    const notifyerror = (err)=> toast.error(err);
    const notifysuccess = (msg)=> toast.success(msg);
    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            notifyerror('please login')
            navigate('/login')
        }
    }, [])

  const loadfile = (e) => {
    let output = document.getElementById("output");
    output.src = URL.createObjectURL(e.target.files[0]);
  };

  const postDetails = async () => {

    const data = new FormData();
    data.append("file", postimg);
    data.append("upload_preset", "socialUp");
    data.append("cloud_name", "inthicloud1");
    try{
        const cloudResponse = await axios.post(
            import.meta.env.VITE_CLOUDINARY_URL,
            data
          );
         if(cloudResponse.data.url){
            seturl(cloudResponse.data.url);
         }
          
    }catch(error){
        notifyerror(error)
    };

    try{
        const postdata = {caption, url};
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_CONNECTION}/post/createpost`, postdata, {withCredentials:true} );
        if(response.data.message){
            notifysuccess(response.data.message);

            navigate('/')
        }
        else{
            notifyerror(response.data.error)
        }
        
    }catch(error){
        notifyerror(error)
    }
    
  };
  const handleInputFile = useRef(null);
  const handleClick = ()=>{
    handleInputFile.current.click()
  }

  return (
    <>
      <div className="container">
        <div className="createpost">
          <div className="prode" style={{ position: "relative" }}>
            <div className="proimg">
              <img
              src="https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"
                alt=""
              />
            </div>
            <h2>{JSON.parse(localStorage.getItem('user')).username}</h2>
            <h2
              style={{ position: "absolute", right: 10 }}
              onClick={postDetails}
            >
              Share
            </h2>
          </div>
          <div className="previewimg">
            <img
            onClick={()=> handleClick()}
              id="output"
              src="https://i.fbcd.co/products/resized/resized-750-500/563d0201e4359c2e890569e254ea14790eb370b71d08b6de5052511cc0352313.jpg"
              alt=""
              style={{cursor:'pointer'}}
            />
          </div>
          <input
          ref={handleInputFile}
            type="file"
            style={{display:'none'}}
            onChange={(e) => {
              loadfile(e);
              setpostimg(e.target.files[0]);
            }}
          />
          <textarea
            name=""
            id=""
            placeholder="Caption"
            onChange={(e) => {
              setcaption(e.target.value);
            }}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
