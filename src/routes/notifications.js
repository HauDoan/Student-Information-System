import express from 'express'
import ThongbaoDB from "../models/notificationModel.js";

const Router = express()

// url: /notifications
Router.get('/', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        var auth = user.isAdmin
        const thongbaos = await ThongbaoDB.find({})
        res.render('notifications', { thongbaos, user, auth })
    }
    catch (err) {
        res.status(400).json(err)
    }
})

Router.get('/posting', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        var auth = user.isAdmin
        res.render('postingNotify', { user, auth })
    } catch (error) {
        res.status(400).json(err)
    }
})


Router.post('/posting', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        var auth = user.isAdmin
        let thongbaodb = new ThongbaoDB({
            title: req.body.title,
            text: req.body.text,
            user: req.body.name,
            createdAt: moment().format("DD/MM/YYYY HH:mm")

        })
        thongbaodb
            .save(thongbaodb)
            .then(data => {
                res.render('thongbao', { auth, user })
            })
    }
    catch (error) {
        res.status(400).json(err)
    }


})
export default Router;