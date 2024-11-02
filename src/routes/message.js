import express from 'express'
import Message from '../models/messageModel.js';
import User from '../models/accountModel.js'
import Post from '../models/postModel.js'

const Router = express();
Router.get('/message', async (req, res) => {
    if (!req.session.key) {
        return res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        var auth = user.isAdmin
        const postTimeline = await Post.find({}).sort({ createdAt: -1 })
        res.render('home', { postTimeline, user, auth })
    }
    catch (err) {
        res.status(400).json(err)
    }
})

Router.post('/', async (req, res) => {
    if (!req.session.key) {
        return res.redirect('/login')
    }
    try {
        const newMessage = new Message(req.body)
        const Message = await newMessage.save()
        res.json({ code: 0, message: 'Luu thong tin post', data: Message })
    }
    catch (err) {
        res.status(500).json(err);
    }
})

export default Router;