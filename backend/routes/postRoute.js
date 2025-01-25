import express from "express";
import {createpost, allposts, myposts, likeandunlikepost, commentandUncomment, deletePost} from '../controllers/postControllers.js'
import isloggedIn from "../middleware/isLoggedIn.js";
const router = express.Router();


router.post('/createpost', isloggedIn, createpost)
router.get('/allposts', isloggedIn, allposts)
router.get('/myposts', isloggedIn, myposts)
router.put('/likeandunlikepost', isloggedIn, likeandunlikepost);
router.post('/comment', isloggedIn, commentandUncomment)
router.delete('/delete/:id', isloggedIn, deletePost)


export default router;