const connectToMongo = require("./db");
const express = require('express');
connectToMongo();
const app = express()
const port = 5000

app.use(express.json());

//availabe routes
app.use('/api/auth' , require("./routers/auth"));
app.use('/api/notes' , require("./routers/notes"));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})