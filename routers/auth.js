const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//Create new user with the help of this logic /api/auth/createuser
const jwt_SECRET = "my name is @khan";
router.post('/createuser',[
   //Validation for user 
   body('email','Enter valid email').isEmail(),
   body('password','Password must be longer than 4 digits').isLength({ min: 5 }),
   body('name','Enter valid name').isLength({ min: 3 })
], async (req,res)=>{
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
     }
     //check if user with this email exist
     try {
     let user = await User.findOne({email:req.body.email}) ;
     if(user)
     {
        return res.status(400).json({error:"Sorry a user already exist with same email....."});
     }
     const salt = await bcrypt.genSalt(10);
     const secPass = await bcrypt.hash(req.body.password,salt);
     user = await User.create({
   name: req.body.name,
  email: req.body.email,
  password:secPass,
 })
  const data = 
 {
    user:{
       id:user.id,
    }
 }
 const jwt_data = jwt.sign(data,jwt_SECRET);
 console.log(jwt_data);
 res.json(user);
}
   catch (error) {
       console.error (error.message);
       res.status(500).send("Some error occured");
   }



//  .then(user => res.json(user))
//  .catch(err=>
//  {
//     console.log(err)
//     res.json({error:"Enter a unique email address!!!!",message:err.message});
//  })
// res.json(user);
});

module.exports = router;
