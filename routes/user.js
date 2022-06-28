
const mongoose=require('mongoose')

const express=require('express')
const Router=express()
const User=require('../models/UserModel')
const {validationResult}=require('express-validator')
const registerValidator= require('./validator/registerValidator')
const bcrypt=require('bcrypt')



Router.get("/",async(req,res)=>
{
    try{
        const user =await User.findById(req.body.userID)
        res.status(200).json(user.email)
    }
    catch(err)
    {
        res.status(404).json(err);
    }
    // res.send('User route')
})
Router.post('/register',(req,res)=>
{
    let result=validationResult(req)
    console.log(req.body)
    let message='';
    if (result.errors.length===0)
    {
        let {name,username,password,post}=req.body
        let hash=bcrypt.hash(password,10)
        .then(
            hashed=>
            {
                let user=new User({
                    name: name,
                    username: username,
                    password: hashed,
                    post: post,
                })
                user.save()
                .then (()=>
                {
                    return  res.json({code: 0,message:'Register Succesful!!',data: user})
                })
                .catch(e=>
                    {
                        if (e.message.includes('E11000 duplicate key error collection: CK.accounts index: username_1 dup key:'))
                        {
                            return res.json({code: 3, message:"Username đã tồn tại. Vui lòng nhập username khác."})
                        }
                        return res.json({code:2,message:'Register fail !!'+e.message})
                    })
            }
            
        )

    }
    else 
    {
        let messages=result.mapped()

        for (m in messages)
        {
            message=messages[m]
            break;
    
        }
        return res.json({code: 1, message: message})

    }
  
})
Router.put('/:id/follow',async (req,res)=>
{
    try {
        // const userFollow=User.findById(req.params.id)
        const  user=await User.findById(req.body.userID)
        // console.log(user.followers)
        if (!user.followers.includes(req.params.id))
        {
            await user.updateOne({$push:{followers:req.body.userID}})
            res.status(200).json("Follow user successful!!")
        }
        else 
        {
            await user.updateOne({$pull:{followers:req.body.userID}})
            res.status(200).json("Unfollow user successful!!");
        }
    }
    catch (err)
    {
        res.status(500).json(err);
    }
})

module.exports=Router
