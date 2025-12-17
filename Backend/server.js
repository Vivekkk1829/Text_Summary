const express = require('express');
const app =express();
const mongoose= require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());


const authRouter=require('./routes/auth-route.js')

//Connect to MongoDB
mongoose.connect('mongodb+srv://vivekkatta295:vivek@cluster0.fmuvhq2.mongodb.net/?appName=Cluster0').then(()=>{
 console.log("Connected to MongoDB");
})
.catch((err)=>console.log(err));
app.use(cors({
     origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/api/auth',authRouter);



const port=3000;
app.listen(port,()=>{
    console.log(`App is tunning sucessfully on ${port}`);
})