const { type } = require('express/lib/response');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema(
    {
        username: {
            type: String
        },
        name:{
            type: String,
        },
        password: {
            type: String
        },
        avatar: 
        {
            type: String,
            default: 'no_avatar.jpg'
        }
        ,
        role: {
        type: Array
        },
        role_post: {
            type: Array
            },
        isAdmin: {
            type: Boolean,
            default: false
        }
    });

module.exports = mongoose.model('Account1', AccountSchema)