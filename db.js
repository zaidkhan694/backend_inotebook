const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true";
const connectToMongo = () =>
{
    mongoose.connect(mongoURI,  (err) => {
        if(err) console.log(err) 
        else console.log("mongodb is connected");
       }
     );
}

module.exports = connectToMongo;