

const express=require('express')
const Router=express()
const Phongban=require('../models/PhongbanModel')
const {validationResult}=require('express-validator')
const registerValidator= require('./validator/registerValidator')
const bcrypt=require('bcrypt')

Router.get("/", (req,res)=>
{
            try 
            {
                Phongban.find({},async function(err, users) {
                    var userMap = {};
                
                    await users.forEach(function(user) {
                      userMap[user._id] = user;
                    });
                
                    res.status(200).json(userMap)
                  });
            }
            catch(err)
            {
                res.status(400).json(err)
            }
      
})

Router.post('/register',(req,res)=>
{
    let result=validationResult(req)
    console.log(req.body)
    let message='';
    if (result.errors.length===0)
    {
        let {name,username,password,kyhieu}=req.body
        let hash=bcrypt.hash(password,10)
        .then(
            hashed=>
            {
                let phongban=new Phongban({
                    name: name,
                    username:username,
                    password: hashed,
                    kyhieu: kyhieu,
                })
                phongban.save()
                .then (()=>
                {
                    return  res.json({code: 0,message:'Register Succesful!!',data: phongban})
                })
                .catch(e=>
                    {
                        if (e.message.includes('E11000 duplicate key error collection: CK.phongbans index: name_1 dup key:'))
                        {
                            return res.json({code: 3, message:"Tên phòng ban đã tồn tại."})
                        }
                        if (e.message.includes('E11000 duplicate key error collection: CK.phongbans index: kyhieu_1 dup key:'))
                        {
                            return res.json({code: 3, message:"KÝ hiệu phòng ban đã tồn tại."})
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
module.exports=Router
