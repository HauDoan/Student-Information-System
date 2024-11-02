import express from 'express'
import NotifyModel from "../models/notificationModel.js";

const Router = express();

Router.get('/:id', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        var auth = user.isAdmin
        const notify = await NotifyModel.findById(id)
        if (notify) {
            res.render('chitietthongbao', { notify, user, auth })
        } else {
            res.redirect('home')
        }
    } catch (error) {
        res.render('error');
    }

})

export default Router;