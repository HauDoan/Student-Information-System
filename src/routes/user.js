import express from ('express')
import User from ('../models/UserModel')
import { validationResult } from ('express-validator')
import bcrypt from ('bcrypt')
const Router = express

Router.get("/", async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        const auth = user.isAdmin
        res.status(200).json(user.email)
    }
    catch (err) {
        res.status(404).json(err);
    }
})
Router.post('/register', (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    let result = validationResult(req)
    let message = '';
    if (result.errors.length === 0) {
        let { name, username, password, post } = req.body
        bcrypt.hash(password, 10)
            .then(
                hashed => {
                    let user = new User({
                        name: name,
                        username: username,
                        password: hashed,
                        post: post,
                    })
                    user.save()
                        .then(() => {
                            return res.json({ code: 0, message: 'Register Succesful!!', data: user })
                        })
                        .catch(e => {
                            if (e.message.includes('E11000 duplicate key error collection: CK.accounts index: username_1 dup key:')) {
                                return res.json({ code: 3, message: "Username đã tồn tại. Vui lòng nhập username khác." })
                            }
                            return res.json({ code: 2, message: 'Register fail !!' + e.message })
                        })
                }

            )

    }
    else {
        let messages = result.mapped()
        for (m in messages) {
            message = messages[m]
            break;
        }
        return res.json({ code: 1, message: message })

    }

})
Router.put('/:id/follow', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    try {
        const id = req.session.key
        let user = await User.findById(id);
        const auth = user.isAdmin
        if (!user.followers.includes(id)) {
            await user.updateOne({ $push: { followers: req.body.userID } })
            res.status(200).json("Follow user successful!!")
        }
        else {
            await user.updateOne({ $pull: { followers: req.body.userID } })
            res.status(200).json("Unfollow user successful!!");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

export default Router;
