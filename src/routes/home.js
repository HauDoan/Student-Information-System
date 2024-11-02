import express from 'express'
import Post from '../models/postModel.js'
import User from '../models/accountModel.js'

const Router = express()

Router.get('/', async (req, res) => {
    if (!req.session.key) {
        return res.redirect('/login')
    }
    try {
        const id = req.session.key
        const user = await User.findById(id)
        const postTimeline = await Post.find({}).sort({ createdAt: -1 })
        const auth = user.isAdmin
        console.log(postTimeline);
        return res.render('home', { postTimeline, user, auth })
    }
    catch (err) {
        return res.status(400).json(err)
    }
})

export default Router;