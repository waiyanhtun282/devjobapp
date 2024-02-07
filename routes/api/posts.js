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

// @route     GET api/posts
// @desc      Get All Post
// @acess     Private

router.get('/',auth,async (req,res) =>{
    try {
        const  posts = await Post.find().sort({date:-1});
      res.json(posts);
        // console.log(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
        
    }
})

// @route     GET api/posts/:id
// @desc      Get  Post BY Id
// @acess     Private
router.get('/:id',auth,async(req,res) =>{
 try {
    const post = await Post.findById(req.params.id);
    if(!post) {
        return res.status(404).json({msg:'Post Not Found'});
    }
    res.json(post);

 } catch (error) {
    console.error(error.message);
    if(error.kind ==='ObjectId'){
        return res.status(404).json({msg:'Post Not Found'})
    }
    res.status(500).send('Server Error!')
    
 }
});

// @route     DELETE api/posts/:id
// @desc      Delete  Post  
// @acess     Private

router.delete('/:id',auth,async(req,res) =>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({msg:'Posts Not Found!'})
     }
    // Check User
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({msg:'User not Unauthrozied!'});
    
      };
    await post.deleteOne();
    res.json({msg:'Post is removed!'})
  } catch (error) {
    console.error(error.message);
    if(error.kind==='ObjectId'){
        return res.status(404).json({msg:'Post Not Found'})
    }
    res.status(500).send('Server Error!')
  }
});

// @route     PUT api/posts/like/:id
// @desc      Like  Post  
// @acess     Private


router.put('/like/:id',auth,async(req,res) =>{
  try {
    const post = await Post.findById(req.params.id);

    // Check if th post like 
    if(post.likes.filter((like) => like.user.toString() === req.use.id ).length > 0){
      return res.status(400).json({msg:'Post already Liked'})
    };
    post.likes.unshift({user:req.user.id});
    await post.save();
    res.json(post.likes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error!')
  }
});

// @route     PUT api/posts/unlike/:id
// @desc      unlike  Post  
// @acess     Private

router.put('/unlike/:id',auth,async(req,res) =>{
  try {
    const post =await Post.findById(req.params.id);
    //  check  if the post like already  been like
    if(post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({msg:'Post has not yet Liked'})
         
    };
    
    const removeIndex =post.likes.map((like) => like.user.toString()).indexOf(req.user.id);  
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error!')
  }
})
module.exports=router;