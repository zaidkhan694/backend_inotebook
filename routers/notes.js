const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../Middleware/fetchUser");
const { body, validationResult } = require('express-validator');
//Route 1 : to fetch all the notes of user
router.get('/fetchAllNotes',fetchUser,async(req,res)=>{
    try {
        const notes = await Note.find({user:req.user.id});
    res.json(notes);
    }  catch (error) {
        console.error (error.message);
        res.status(500).send("Some error occured");
    }
       
});
//Route 2 : to add note of user
router.post('/addNotes',fetchUser,[ 
    body('title','Enter valid title').isLength({ min: 3 }),
body('description','Enter description minimum 5 characters').isLength({ min: 5 })],async(req,res)=>{
    try {
        const {title,description,tag} = req.body;
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
     }
     const note = new Note(
         {
             title,description,tag,user:req.user.id
         }
     )
     const savedNotes = await note.save();
 res.json(savedNotes);
    } catch (error) {
        console.error (error.message);
        res.status(500).send("Some error occured");
    }
}); 

module.exports = router;
