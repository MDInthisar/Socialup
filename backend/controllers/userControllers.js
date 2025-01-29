import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

export const getprofile = async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });

  if (!user) return res.json({ error: "user not found" });

  const post = await postModel.find({ postedBy: req.params.id });

  res.json({ user, post });
};

export const followandunfollow = async (req, res) => {
  const searchedUser = await userModel.findOne({ _id: req.params.id });
  const currentUser = await userModel.findOne({ _id: req.user.userID });

  if (!searchedUser) return res.json({ error: "user not found" });

  if (req.params.id === req.user.userID)
    return res.json({ error: "you cannot follow unfollow yourself" });

  const isFollowing = currentUser.following.includes(searchedUser._id);

  if (isFollowing) {
    // unfollow user
    await userModel.findByIdAndUpdate(
      { _id: currentUser._id },
      { $pull: { following: searchedUser._id } }
    );
    const userdata = await userModel.findByIdAndUpdate(
      { _id: searchedUser._id },
      { $pull: { followers: currentUser._id } }
    );
    res.json({ message: "unfollow", userdata });
  } else {
    // follow user
    await userModel.findByIdAndUpdate(
      { _id: currentUser._id },
      { $push: { following: searchedUser._id } }
    );
    const userdata = await userModel.findByIdAndUpdate(
      { _id: searchedUser._id },
      { $push: { followers: currentUser._id } }
    );
    res.json({ message: "follow", userdata });
  }
};

export const profileimage = async (req, res) => {
  const { url } = req.body;

  const user = await userModel.findOne({ _id: req.user.userID });
  if (!user) return res.json({ error: "user not found" });

  await userModel.findByIdAndUpdate(
    { _id: req.user.userID },
    { $set: { profileImage: url } }
  );
  res.json({ message: "Profile Image set successfull" });
};

export const removeprofile = async (req, res) => {
  const user = await userModel.findOne({ _id: req.user.userID });

  if (!user) return res.json({ errror: "user not found" });

  user.profileImage = null;
  await user.save();
  res.json({ message: "remove profile pic sucessfull" });
};

export const editprofile = async (req, res) => {
  const { username, bio } = req.body;

  const user = await userModel.findOne({ _id: req.user.userID });
  const existusername = await userModel.findOne({ username });
  if (!user) return res.json({ error: "user not found" });

  if (existusername)
    return res.json({ error: "this username already taken" });  

  user.username = username || user.username;
  user.bio = bio || user.bio;
  const edituser = await user.save();

  // const editeduser = await userModel.findByIdAndUpdate({ _id: req.user.userID }, { username, bio }).select('-password');

  res.json({ message: "Profile update successful", edituser });
};

export const suggestion = async (req, res)=>{
  const user = await userModel.findOne({_id: req.user.userID});

  if(!user) return res.json({error: 'user not found'});

  const myfollowing = user.following;
  
  const result = await userModel.find({_id: {$nin: [...myfollowing, user._id]}});

  res.json(result)
}