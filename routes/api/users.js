const express =require('express');
const router =express.Router();
const { check ,validationResult} =require('express-validator');
// @route     POST api/users
// @desc      Register user
// @acess     Public

router.post('/',[
    check('name',"Name is required")
    .not()
    .isEmpty(),
    check('email','Please include is valid email!')
    .isEmail(),
    check('password','Password is more than 8 characters')
    .isLength({min:8}),
    
],(req,res) => {
    // console.log(req.body);
    const errors =validationResult(req);
    if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()})
    }
    res.send('Users Route')}
);

module.exports=router;