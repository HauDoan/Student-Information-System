//get home, get user, get post from user

import express from 'express'
const Router=express()

import Post from '../models/PostModel.js'
import User from '../models/UserModel.js'
import Phongban from '../models/PhongbanModel.js'

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
export default Router