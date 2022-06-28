const mongoose=require('mongoose')
const Schema=mongoose.Schema

const PhongBanSchema=new Schema(
    {
        name: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true,
        },
        username:{
            type: String,
            require:true,
            max: 50,
            unique:true,
        },
        password :{
            type: String,
            required: true,
            min: 6
        },
        kyhieu:
        {
            type: String,
            require: true,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
});

module.exports=mongoose.model('Phongban', PhongBanSchema)
