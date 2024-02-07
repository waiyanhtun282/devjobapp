const express =require('express');
const router =express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult}= require('express-validator');

const User =require('../../models/Users');
const Profile=require('../../models/Profile');
const Post = require('../../models/Post');
// @route     POST api/posts
// @desc      Creaete Post
// @acess     Private

router.post('/',[
    auth,[
        check('text','Text is requires').not().isEmpty()
    ]
], async (req,res) => {
  const error = await validationResult(req);
 if(!error.isEmpty()) {
    return res.status(400).json({error:error.array()});
 };

 try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost =new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
    });
    const post = await newPost.save();
    res.json(post)
 } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Errror!')
 }
})

module.exports=router;