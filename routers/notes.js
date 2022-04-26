const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
    obj =
    {
        name:"saifkhan",
        number:14,
    }
    res.json(obj);
});

module.exports = router;