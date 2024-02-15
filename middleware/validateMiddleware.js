// validateMiddleware.js
const {  check } = require('express-validator');

 const validateRegisterInput = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include is valid email!").isEmail(),
    check("password", "Password is more than 8 characters").isLength({
      min: 8,
    }),
  ];
  
 const validateLoginInput = [
  check("email", "Please include a valid email!").isEmail(),
  check("password", "Password is required").exists(),
];

const validateCreateUpdateProfile = 
 [
      check("status", "Status is Required!").not().isEmpty(),
      check("skills", "Skils is Required!").not().isEmpty(),
    ];

    const validateProfileExperience = [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required!").not().isEmpty(),
      check("from", "Date is required!").not().isEmpty(),
    ];

    const validateProfileEducation = [
      check("school", "School is required!").not().isEmpty(),
      check("degree", "Degree is requires!").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is requires!").not().isEmpty(),
      check("from", "from is required!").not().isEmpty(),
    ];


module.exports ={
  validateLoginInput,
  validateRegisterInput,
  validateCreateUpdateProfile,
  validateProfileExperience,
  validateProfileEducation
}



