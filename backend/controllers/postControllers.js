import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

export const createpost = async (req, res) => {
  const { caption, url } = req.body;

  if (!caption || !url) return res.json({ error: "all feild requied" });
  const user = await userModel.findOne({_id: req.user.userID});

  const post = await postModel.create({
    caption,
    postimage: url,
    postedBy: req.user.userID,
  });

  res.json({ message: "post sucessfull", user });
};

export const allposts = async (req, res) => {
  const user = await userModel.findOne({_id: req.user.userID});
  const userfollowingpost = user.following || [];
  
  const posts = await postModel.find({postedBy: {$in: [...userfollowingpost, user._id] }}).populate("postedBy");
  res.json(posts);
};

export const myposts = async (req, res) => {
  const user = await userModel.findOne({_id: req.user.userID});
  const post = await postModel
    .find({ postedBy: req.user.userID })
    .populate("postedBy");
  res.json({user, post});
}; 

export const likeandunlikepost = async (req, res) => {
  const post = await postModel.findOne({ _id: req.body.postID });
  const user = await userModel.findOne({ _id: req.user.userID });

  if (!post) return res.json({ error: "post not found" });

  if (!user) return res.json({ error: "user not found please Login" });

  const checkUserLike = await post.likes.includes(user._id);

  if (!checkUserLike) {
    // add like in likes array
    const result = await postModel.findByIdAndUpdate(
      { _id: post._id },
      { $push: { likes: user._id } },
      { new: true }
    );
    res.json(result);
  } else {
    // remove like in likes array
    const result = await postModel.findByIdAndUpdate(
      { _id: post._id },
      { $pull: { likes: user._id } },
      { new: true }
    );
    res.json(result);
  }
};

export const commentandUncomment = async (req, res) => {
    const { comment, postID } = req.body;
  
    if (!comment) return res.json({ error: "comment empty" });
  
    // Find the post by postID
    const post = await postModel.findOne({ _id: postID });
  
    if (!post) return res.json({ error: "post not found" });

    const commentData = {
        comment,
        commentedBy: req.user.userID
    }

    // Add the comment and commentedBy field
    const result = await postModel
      .findByIdAndUpdate(
        { _id: postID },
        {
          $push: { comments: commentData},
        },
        { new: true }
      )
      .populate('comments.commentedBy');  // Populate the commentedBy field of the comments array
  
    // Return the updated post with populated user data in comments
    res.json(result);
  };
  
export const deletePost = async (req, res)=>{
  const post = await postModel.findOne({_id: req.params.id});

  if(!post) return res.json({error: 'post not found'});  

  if(post.postedBy.toString() !== req.user.userID){
    return res.json({error: 'you are not authorrized to delete post'})
  };

  await postModel.findByIdAndDelete({_id: req.params.id})
  res.json({message: 'post delete sucessfull'})

}