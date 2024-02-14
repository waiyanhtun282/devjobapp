// validateMiddleware.js
const {  check } = require('express-validator');

 exports.validateRegisterInput = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include is valid email!").isEmail(),
    check("password", "Password is more than 8 characters").isLength({
      min: 8,
    }),
  ];
  
exports.validateLoginInput = [
  check("email", "Please include a valid email!").isEmail(),
  check("password", "Password is required").exists(),
];




