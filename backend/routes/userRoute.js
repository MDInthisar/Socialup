import express from 'express';
import isloggedIn from '../middleware/isLoggedIn.js';
import { getprofile, followandunfollow, profileimage, removeprofile, editprofile, suggestion } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/getprofile/:id', isloggedIn, getprofile);
router.post('/followandunfollow/:id', isloggedIn, followandunfollow);
router.put('/profileimage', isloggedIn, profileimage)
router.delete('/removeprofile', isloggedIn, removeprofile)
router.put('/editprofile', isloggedIn, editprofile)
router.get('/suggestion', isloggedIn, suggestion)

export default router;