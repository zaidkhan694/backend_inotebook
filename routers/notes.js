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
//Route 3 : Update note of user /api/notes/updateNotes
router.put('/updateNotes/:id',fetchUser,async(req,res)=>{
    try {
        
const{title,description,tag} = req.body;
const newNote = {

};
if(title)
{
    newNote.title = title;
} 
if(description)
{
    newNote.description = description;
}
if(tag)
{
    newNote.tag = tag;
}
//Module 3 :Find the note to update and update it....
let note = await Note.findById(req.params.id);
if(!note)
{
   return res.status(404).send("Not Found");
}
if(  note.user.toString() !== req.user.id)
{
    return res.status(401).send("Not Allowed");
}
note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json(note);
    }
    catch (error) {
        console.error (error.message);
        res.status(500).send("Some error occured");
    }
});
//Module 4 :Find the note to delete and delete it....

router.delete('/deleteNotes/:id',fetchUser,async(req,res)=>{
    try {
    const{title,description,tag} = req.body;
    const newNote = {
    };
    if(title)
    {
        newNote.title = title;
    } 
    if(description)
    {
        newNote.description = description;
    }
    if(tag)
    {
        newNote.tag = tag;
    }
    let note = await Note.findById(req.params.id);
    if(!note)
    {
       return res.status(404).send("Not Found");
    }
    if(  note.user.toString() !== req.user.id)
    {
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success":"The note has been deleted" , note:note });
}
catch (error) {
    console.error (error.message);
    res.status(500).send("Some error occured");
}
    });
module.exports = router;
