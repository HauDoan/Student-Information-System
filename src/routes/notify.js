import express from 'express'
import NotifyModel from "../models/notificationModel.js";

const Router = express();

Router.get('/:id', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        var id = req.params.id
        var auth = req.cookies['user']
        const notify = await NotifyModel.findById(id)
        if (notify) {
            res.render('chitietthongbao', { notify, auth })
        } else {
            res.redirect('home')
        }
    } catch (error) {
        console.log(error);
        res.render('error');
    }

})

export default Router;