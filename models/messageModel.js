const mongoose=require('mongoose')
const Schema=mongoose.Schema

const MessageSchema=new Schema(
    {
      userID: {
          type: String,
          require: true,
      },
      userName: {
        type: String,
        require: true,
    },
      desc: {
          type: String,
          max:500,
      },
    }
    ,
    {
        timestamps: true,
    }
);

module.exports=mongoose.model('message', MessageSchema)
