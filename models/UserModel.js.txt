const { type } = require('express/lib/response');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name:
        {
            type: String,
            require: true,
            // unique: true,
        },
        username: {
            type: String,
            // require: true,
            min: 3,
            max: 20,
            // unique: true,
        },
        email: {
            type: String,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            // required: true,
            min: 6
        },
        avatar: {
            type: String,
            default: "",
        },
        role: 
        {
        type: Array,
        // default: [],
        },
        posts:
        {
            type: Array,
            default:
                [
                    {
                        _id: 
                        {
                            type: String
                        },
                        createdAt:
                        {
                            type: String,
                        },
                        video:
                        {
                            type: String,
                            default: null,
                        },
                        title:
                        {
                            type: String,
                        },
                        description:
                        {
                            type: String,
                        },
                        thumbnail:
                        {
                            type: String,
                            default: null,
                        },
                        comments: {
                            type: Array,
                            default: [
                                {
                                    type: Object,
                                    _id: 
                                    {
                                        type: String
                                    },
                                    name: 
                                    {
                                        type: String
                                    },
                                    avatar: {
                                        type: String
                                    },
                                    description: 
                                    {
                                        type: String
                                    }
                                }
                            ]
                        }
                    }
                   
                ]
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    });

module.exports = mongoose.model('Account', UserSchema)
