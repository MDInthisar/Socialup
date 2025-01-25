import mongoose, { Types } from "mongoose";

const postSchema = mongoose.Schema({
  caption: {
    type: String,
    requied: true,
  },
  postimage: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  comments:[
    {
      comment:{ type: String},
      commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  date:{
    type:Date,
    default: Date.now()
  }
});

export default mongoose.model("post", postSchema);
