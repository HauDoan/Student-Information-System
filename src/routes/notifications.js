import express from 'express'
import ThongbaoDB from "../models/notificationModel.js";

const Router = express()

// url: /notifications
Router.get('/', async (req, res) => {
    if (!req.cookies['auth']) {
        return res.redirect('/login')
    }
    try {
        let id = req.cookies['session-secret']
        var auth = req.cookies['user']
        const thongbaos = await ThongbaoDB.find({})
        res.render('notifications', { thongbaos, auth })
    }
    catch (err) {
        res.status(400).json(err)
    }
})

Router.get('/posting', async (req, res) => {
    if (!req.cookies['auth']) {
        return res.redirect('/login')
    }
    try {
        var id = req.cookies['session-secret']
        var auth = req.cookies['user']
        const user = await User.findById(id)
        res.render('postingNotify', { user, auth })
    } catch (error) {
        res.status(400).json(err)
    }
})


Router.post('/posting', async (req, res) => {
    if (!req.session.auth) {
        return res.redirect('/login')
    }
    var auth = req.cookies['user']
    let thongbaodb = new ThongbaoDB({
        title: req.body.title,
        text: req.body.text,
        user: req.body.name,
        createdAt: moment().format("DD/MM/YYYY HH:mm")

    })
    thongbaodb
        .save(thongbaodb)
        .then(data => {
            res.render('thongbao', { auth })
        })

})
export default Router;