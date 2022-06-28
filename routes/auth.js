
const mongoose=require('mongoose')


const router=require('express').Router()

router.get("/",(req,res)=>
{
    res.send("Auth Route")
})
module.exports=router
