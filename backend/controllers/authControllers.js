import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password)
    return res.json({ error: "all feild requied" });
  const user = await userModel.findOne({ $or: [{ email }, { username }] });
  if (user)
    return res.json({
      error: "user already exist with this username and email",
    });

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await userModel.create({
    fullname,
    username,
    email,
    password: hash,
  });

  res.json({ message: "user created sucessfull" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.json({ error: "all feild requied" });

  const user = await userModel.findOne({ email });

  if (!user) return res.json({ error: "user not found please Signup" });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) return res.json({ error: "password donst match" });

  // genrate JWT
  const token = jwt.sign({ email, userID: user._id }, process.env.JWT_SCRET);
  const { _id, username, fullname } = user;
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 100 * 365.25 * 24 * 60 * 60 * 1000, // for 100 years
  });

  res.json({
    message: "Login successfull",
    token,
    user: { _id, username, fullname },
  });
};

export const forgotpassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  const token = jwt.sign({ email }, process.env.JWT_SCRET, { expiresIn: "1h" });

  const resetLink = `${process.env.FRONTEND_URL}/resetpassword/${token}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: "jtah krcl ljix phlt",
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.json({ error: "Failed to send reset email. Please try again later." });
  }
};

export const resetpassword = (req, res) => {
  const { newpassword } = req.body;

  jwt.verify(req.params.id, process.env.JWT_SCRET, async (err, result) => {
    if (err) return res.json({ error: err.message });

    const user = await userModel.findOne({ email: result.email });

    if (!user) return res.json({ error: "something went wrong" });

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newpassword, salt);

    await userModel.findOneAndUpdate(
      { email: user.email },
      { password: hash },
      { new: true }
    );

    res.json({ message: "new password set successfull" });
  });
};

export const googlelogin = async (req, res) => {
  const { name, email, email_verified, picture, clientID } = req.body;
  if (email_verified) {
    const saveduser = await userModel.findOne({ email });
    if (!saveduser) {
      const password = email + clientID;
      const user = await userModel.create({
        username: name,
        fullname: name,
        email,
        password,
        profileImage: picture,
      });

      const { _id, fullname, username } = user;
      const token = jwt.sign({ email, userID: user._id }, process.env.JWT_SCRET);
      res.cookie('token', token)
      res.json({token, user:{ _id, fullname, username}});
    }else{
      const token = jwt.sign({ email, userID: saveduser._id }, process.env.JWT_SCRET);
      const { _id, fullname, username } = saveduser;
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 100 * 365.25 * 24 * 60 * 60 * 1000, // for 100 years
      });
      res.json({token, user:{ _id, fullname, username}});
    }
  }
};
