const User =require('../models/Users');
const Post =require('../models/Post');
const {validationResult}= require('express-validator');


const postCreatePost =async (req,res) => {
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
} ;


const getAllPost =async (req,res) =>{
    try {
        const  posts = await Post.find().sort({date:-1});
      res.json(posts);
        // console.log(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
        
    }
};

const getPostByDetail =async(req,res) =>{
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
};

const deletePost =async(req,res) =>{
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
};

const addLikePost =async(req,res) =>{
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
};

const removeLikePost =async(req,res) =>{
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
}

const addCommentPost =async (req,res) => {
  const error = await validationResult(req);
 if(!error.isEmpty()) {
    return res.status(400).json({error:error.array()});
 };

 try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id)
    const newComment =new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
    });
    post.comment.unshift(newComment)
     await post.save();
    res.json(post.comment)
 } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Errror!')
 }
}

const deleteCommentPost =async(req,res) =>{
 try {
  
    const post  = await Post.findById(req.params.id);
//  pull out comment
const comment = post.comment.find(comment => comment.id === req.params.comment_id);

// Check comment
 if(!comment) {
  return res.status(400).json({msg:"Comment does not exits!"});
 }

// Checek USer 

   if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg:'User is not unrothrized!'})
    }

    // Get Remove index
    const removeIndex = post.comment.map(comment => comment.user.toString()).indexOf(req.user.id);
    post.comment.splice(removeIndex,1);
    await post.save();

    res.json(post.comment)

 } catch (error) {
   console.error(error.message);
   res.status(500).send("Server Error!")
 }
};



module.exports ={
    postCreatePost,
    getAllPost,
    getPostByDetail,
    deletePost,
    addLikePost,
    removeLikePost,
    addCommentPost,
    deleteCommentPost
}