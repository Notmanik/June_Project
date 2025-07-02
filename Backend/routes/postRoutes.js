import express from 'express';
import { getAllPosts, createNewPost, editPost, deletePost} from '../controllers/postController.js';
import verifyToken from '../middlewares/jwtVerifyToken.js';
import mutler from '../middlewares/mutler.js';


const router = express.Router();


router.get('/posts', getAllPosts);
router.post('/newpost',verifyToken, mutler('file','uploads/post-images/') ,createNewPost );
router.put('/editpost/:id',verifyToken, editPost);
router.delete('/deletepost/:id',verifyToken ,deletePost);
export default router;
