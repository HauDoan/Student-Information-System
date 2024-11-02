import res from 'express/lib/response.js'
const { type } = res

import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AccountSchema = new Schema(
    {
        username: {
            type: String
        },
        name: {
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

export default mongoose.model('admin', AccountSchema)