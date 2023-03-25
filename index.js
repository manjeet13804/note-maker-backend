
const express = require("express");
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://root:10xacademy@cluster0.kzvn5vw.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to db");
  },
  (err) => {
    console.log(err);
  }
);

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogs")

const cors = require("cors")
const app = express()
app.get("/",(req,res)=>{
  res.send("ok")
})
app.use("/api/user", userRoutes)
app.use("/api/blogs", blogRoutes)
app.use(cors({
  origin: "*"
}))

app.listen(5000, () => console.log("The server is up at 5000 port"));

