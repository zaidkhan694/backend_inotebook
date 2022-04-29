const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchUser = require("../Middleware/fetchUser");
// Route 1 :Create new user with the help of this logic /api/auth/createuser
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
 const authtoken = jwt.sign(data,jwt_SECRET);
 console.log(authtoken);
 res.json(authtoken);
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
// Route 2 :Login authentication for users
router.post('/loginuser',[
   //Validation for user 
   body('email','Enter valid email').isEmail(),
   body('password','password need to be fill').exists(),],
   async (req,res)=>
   {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }
      const {email,password} = req.body;
      try {
         let user = await User.findOne({email});
         if(!user)
     {
        return res.status(400).json({error:"Enter correct credentials to login..1..."});
     }
     const comparePassword = await bcrypt.compare(password,user.password);
     if(!comparePassword)
     {
      return res.status(400).json({error:"Enter correct credentials to login..2..."});
     }

     const data = 
 {
    user:{
       id:user.id,
    }
 }
 const authtoken = jwt.sign(data,jwt_SECRET);
 console.log(authtoken);
 res.json(authtoken);
      }
      catch (error) {
         console.error (error.message);
         res.status(500).send("Internal error occured");
     }
   }
);
// Route 3 :get Login user detail using post "/api/auth/getuser" login required
router.post('/getuser',fetchUser,
   async (req,res)=>
   {
       try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
       res.send(user);
   } catch (error) {
      console.error (error.message);
      res.status(500).send("Internal error occured");
  }
   });
module.exports = router;
