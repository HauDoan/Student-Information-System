//get_post,  create_post, update_post, delete post like, post and dislike, get_post by id 
import Post from '../models/postModel.js'
import User from '../models/accountModel.js'
import moment from 'moment'
import multer from 'multer'
import mongoose from 'mongoose';

moment.locale('vn');
// const upload=multer({dest:'../public/uploads'})
//get_post
const post_index = async (req, res) => {
    const id = '61c320fe86a961e538e18428';
    const post = req.body;
    try {


        //get post from id 
        // const currentUser=await User.findById(id)
        // const userPosts=await Post.find({userID: currentUser._id});
        // const friendPosts= await Promise.all(
        //     currentUser.following.map(friendID=>
        //         {
        //             return Post.find({userID: friendID})
        //         })
        // );
        // userPosts.concat(...friendPosts);
        // res.status(200).json(userPosts.concat(...friendPosts))

        //get all post 
        const postTimeline = await Post.find({}).sort({ createdAt: -1 }, function (err, cursor) { })
        res.status(200).json(postTimeline)


    }
    catch (err) {
        res.status(404).json(err);
    }
}
// create post 
const create_post = async (req, res) => {
    try {
        const user_index = req.body.image
        // console.log(user_index.image.path)

        // console.log(user_index)


        // const id= req.session.key
        // const user=await User.findById(id)
        // const newPost= await new Post({description:user_index.description,user:{name:user.name,avatar:user.avatar,role:"Sinh viên"},thumbnail:'',video:'',createdAt:moment().format('lll'),comments:[] })
        // const savedPost=await newPost.save()
        // await user.updateOne({$push:{posts: newPost}})


        // await user.updateOne({$push:{posts:req.body}})
        // const user=await User.find({"_id" : ObjectId("61c320fe86a961e538e18428")})
        // const user=await  User.find(ObjectId("60a13480c581111b08ae85b6"))
        // user.posts.insertOne(savedPost);
        // User.posts.insertOne(savedPost)
        res.json({ code: 0, message: 'Luu thong tin post', data: savedPost })
    }
    catch (err) {
        res.status(500).json(err);
    }
}
//update post
const update_post = async (req, res) => {
    try {
        var d = await new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var datetime = "0" + curr_date + '-' + "0" + curr_month + '-' + curr_year;
        const post = await Post.findById(req.params.id)

        if (post) {
            await post.updateOne({ $set: { createdAt: datetime } });
            res.status(200).json("Updated post successful!!")
        }
        else {
            res.status(400).json("You only can  update your post")
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
//delete post 
const delete_post = async (req, res) => {
    var postId = req.params.id
    var id = req.session.key
    await Post.deleteOne({ _id: mongoose.Types.ObjectId(postId) });
    const user = await User.findById(id)
    await user.updateOne({ $pull: { posts: { _id: mongoose.Types.ObjectId(postId) } } })
    res.status(200).json(user)
}
//like post and dislike
const like_post = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userID)) {
            await post.updateOne({ $push: { likes: req.body.userID } })
            res.status(200).json("Like post successful!!")
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userID } })
            res.status(200).json("Dislike post successful!!");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}
//get_post by id 
const get_post = async (req, res) => {
    try {
        let avatar = req.body.avatar
        const user = await User.find({ avatar: avatar })
        let name = user.name
        res.status(200).json(user)
    }
    catch (err) {
        res.status(404).json(err);
    }
}
//timeline post 
const post_timeline = async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userID)
        const userPosts = await Post.find({ userID: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map(friendID => {
                return Post.find({ userID: friendID })
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    }
    catch (err) {
        res.status(404).json(err);
    }
}
//get user 
const get_user = async (req, res) => {
    try {
        const user = await User.findById(req.body.userID)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(404).json(err);
    }
}
export default {
    post_index, create_post, update_post, delete_post, like_post, get_post, post_timeline, get_user
}
