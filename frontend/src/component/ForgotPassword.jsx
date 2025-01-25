import axios from 'axios'
import React, { useState } from 'react'
import './ForgotPassword.css' // Make sure to link your CSS file
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    
      const notifyerror = (err) => toast.error(err);
      const notifysuccess = (msg) => toast.success(msg);

    const handleSubmit = async () => {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_CONNECTION}/auth/forgotpassword`, { email });
        if(response.data.message){
            notifysuccess(response.data.message)
        }else{
            notifyerror(response.data.error)
        }
    }

    return (
        <div className="forgot-password">
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                <div className="forgot-password-form">
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
