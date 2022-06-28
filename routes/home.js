//get home, get user, get post from user

const express=require('express')
const Router=express()

const Post= require('../models/PostModel')
const User=require('../models/UserModel')
const Phongban=require('../models/PhongbanModel')


Router.get('/',(req,res)=>{
    res.send('Home Route')
})

// Router.get('/index',async (req,res)=>{
//     try 
//     {
//         const postTimeline=await Post.find({}).sort({createdAt: -1})
//         res.render('trangchu',{postTimeline})
//     }

//     catch(err)
//     {
//     res.status(400).json(err)

//     }    
// });


Router.post('/index',(req,res)=>{
    console.log(req.body)
    res.json(req.body)
})
module.exports=Router