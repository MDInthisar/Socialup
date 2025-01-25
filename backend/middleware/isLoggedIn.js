import express from "express";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const isloggedIn = (req, res, next)=>{
    
    jwt.verify(req.cookies.token, process.env.JWT_SCRET, (err, payload)=>{
        if(payload){
            req.user = payload;
            next()
        }
        else{
            res.json({error:'pls login'})
        }
    })
    
};

export default isloggedIn