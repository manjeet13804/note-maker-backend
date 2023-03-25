const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const blogsModel = require('../models/blogs')
const userModel = require('../models/user')

var jwt = require('jsonwebtoken');
secret = "BLOGS"
const cors=require("cors")
router.use(bodyParser.json())
router.use(cors({
    origin:"*"
}))

router.use('/', (req, res, next) => {
//    console.log(req.body)
//    console.log(req.headers.authorization)
    if (req.headers.authorization) {

        const token = req.headers.authorization.split("BLOGS ")[1];
        try {
            jwt.verify(token,secret , async function (err, decoded) {    //process.env.secret // starting time, decoded object id,
                if (err) {
                    res.status(400).json(err.message)
                }
                console.log(decoded)
                const user = await userModel.findOne({ _id: decoded.data });
                // console.log(user)
                req.user = user.email;            // which user has posted data.  ..............
                // console.log(req.user)
                next();
            });
        }
        catch (e) {
            res.status(400).json(e.message)
        }
    }
    else {
        res.status(400).json({ message: "user invalid" })
    }

})

router.get('/', async (req, res) => {
    try {
        const posts = await blogsModel.find({userid:req.user});  // left = userid from schema right= req.user from front end server 
        res.status(200).json(posts);
        console.log(posts)
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})





router.put('/:id', async (req, res) => {
    try {
        await blogsModel.findByIdAndUpdate(req.params.id, req.body)
        const posts = await blogsModel.findById(req.params.id);
        res.status(200).json(posts);
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})


router.post('/', async (req, res) => {
   
    console.log(req.body)
    try {
        const blog = await blogsModel.create({
            // mention as per the schema which is to be created
            title:req.body.title,
            description:req.body.description,
            userid: req.user           // user id is req.user and req.user is emailid which is set in line 35.
        })
        res.status(200).json({
            message: "success",
            blog
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})

router.delete('/', async (req, res) => {
   
    console.log(req.body)
    try {
        const deletedNotes = await blogsModel.deleteMany({email:req.user })
        res.status(200).json({
            message: "success",
            deletedNotes
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})

router.delete('/:id', async (req, res) => {
   
    console.log(req.body)
    try {
        const deletedNotes = await blogsModel.deleteOne({_id:req.params.id })
        res.status(200).json({
            message: "success",
            deletedNotes
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})
module.exports=router