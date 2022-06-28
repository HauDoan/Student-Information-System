const express=require('express')
const Router=express();
const Message=require('../models/messageModel')

Router.get('/',(req,res)=>
{
    res.send('message Route');
})

Router.post('/', async (req,res)=>
{
    const newMessage=new Message(req.body)
    try 
    {   
        const Message=await newMessage.save()

        res.json({code:0,message:'Luu thong tin post',data:Message})
    }
    catch (err) 
    {
        res.status(500).json(err);
    }

})
Router
module.exports=Router;