const express =require('express');
const router =express.Router();
const auth = require('../../middleware/authMiddleware');
const {check,validationResult}= require('express-validator');

const User =require('../../models/Users');
const Profile=require('../../models/Profile');
const Post = require('../../models/Post');
const { validatePostMiddleware, validatePostCommentMiddleware } = require('../../middleware/validateMiddleware');
const { postCreatePost, getAllPost, getPostDetail, getPostByDetail, deletePost, putLikeDetail, putLikePost, addLikePost, removeLikePost, addCommentPost, deleteCommentPost } = require('../../controllers/postController');
// @route     POST api/posts
// @desc      Creaete Post
// @acess     Private

router.post('/',[
    auth,validatePostMiddleware
], postCreatePost);


// @route     GET api/posts
// @desc      Get All Post
// @acess     Private

router.get('/',auth,getAllPost)

// @route     GET api/posts/:id
// @desc      Get  Post BY Id
// @acess     Private
router.get('/:id',auth,getPostByDetail);

// @route     DELETE api/posts/:id
// @desc      Delete  Post  
// @acess     Private

router.delete('/:id',auth,deletePost);

// @route     PUT api/posts/like/:id
// @desc      Like  Post  
// @acess     Private


router.put('/like/:id',auth,addLikePost);

// @route     PUT api/posts/unlike/:id
// @desc      unlike  Post  
// @acess     Private

router.put('/unlike/:id',auth,removeLikePost)


// @route     POST api/posts/comment/:id
// @desc      Comment  Post  
// @acess     Private
router.post('/comment/:id',[
    auth,validatePostCommentMiddleware
],addCommentPost )
// @route     POST api/posts/comment/:id/:comment_id
// @desc     Delete   Post  Comment
// @acess     Private
router.delete('/comment/:id/:comment_id',auth,deleteCommentPost)
module.exports=router;