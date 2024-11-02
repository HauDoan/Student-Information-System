import pkg from 'express/lib/response.js';
const { type } = pkg;
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name:
        {
            type: String,
            require: true,
        },
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true,
        },
        email: {
            type: String,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            min: 6
        },
        avatar: {
            type: String,
            default: "",
        },
        khoa:
        {
            type: String,
            default: []
        },
        class:
        {
            type: String,
            default: []
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

export default mongoose.model('account', UserSchema)
