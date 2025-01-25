import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:String,
    fullname:String,
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    bio:String,
    profileImage:{
        type:String,    
    }
});

export default mongoose.model('user', userSchema);