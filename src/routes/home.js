import express from 'express'
import Post from '../models/postModel.js'
import User from '../models/accountModel.js'

const Router = express()

Router.get('/', async (req, res) => {
    if (!req.session.key) {
        return res.redirect('/login')
    }
    try {
        var auth = req.cookies['auth']
        var id = req.cookies['session-secret']
        if (auth === '0') {
            const user = await User.findById(id)
            const postTimeline = await Post.find({}).sort({ updatedAt: -1 })
            return res.render('home', { postTimeline, user, auth })
        }
        else {
            const user = await User.findById(id)
            const postTimeline = await Post.find({}).sort({ updatedAt: -1 })
            return res.render('home', { postTimeline, user, auth })
        }
    }
    catch (err) {
        return res.status(400).json(err)

    }
})

export default Router;