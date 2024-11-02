import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PostSchema = new Schema(
    {
        user: {
            type: Object,
            require: true,
            name:
            {
                tpye: String
            },
            avatar:
            {
                type: String
            },
            email:
            {
                type: String
            }
        },
        description: {
            type: String,
            max: 500,
        },
        thumbnail: {
            type: String,
            default: ''
        },
        video:
        {
            type: String,
            default: ''
        },
        createdAt:
        {
            type: String
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
        },
        timestamp: String,
    });

export default mongoose.model('Post', PostSchema)
