import React, { useContext } from 'react';
import './LogoutModel.css';
import { LoggedInContext } from '../context/LoggedInContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogoutModel = ({ setmodelOpen }) => {
    const navigate = useNavigate();
    const notifysuccess = (msg)=> toast.success(msg)

  return (
    <>
      <div className="logcontainer" onClick={()=> setmodelOpen(false)}>
        <div className="logmodel">
          <h1>Confirm Logout</h1>
          <p>Are you sure you want to log out?</p>
          <div className="btn">
            <button className="btn-primary"onClick={()=>{
                localStorage.clear();
                notifysuccess('Logout sucessfull')
                navigate('/login');
                
            }}>Logout</button>
            <button className="btn-secondary" onClick={()=> setmodelOpen(false)} >Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModel;
