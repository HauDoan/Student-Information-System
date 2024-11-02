import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MessageSchema = new Schema(
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
            max: 500,
        },
    }
    ,
    {
        timestamps: true,
    }
);

export default mongoose.model('message', MessageSchema)
