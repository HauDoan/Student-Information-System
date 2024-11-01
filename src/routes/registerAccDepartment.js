import express from 'express'
import User from '../models/adminModel.js'
import bcrypt from 'bcrypt'
import registerValidator from '../validator/registerValidator.js'

const Router = express();
Router.get('/', async (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    var auth = req.cookies['auth']
    const error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const user = req.session.user || ''
    const role = req.flash('role') || ''
    const role_post = req.flash('role_post') || ''
    res.render('registerAcc', { error, password, user, role, role_post, auth })
})

Router.post('/', registerValidator, (req, res) => {
    if (!req.session.key) {
        res.redirect('/login')
    }
    let result = validationResult(req)
    if (result.errors.length === 0) {

        const { username, password, role, role_post } = req.body
        User.findOne({ username: username })
            .then(acc => {
                if (acc) {
                    req.flash('error', 'Tài khoản này đã tồn tại (trùng username)')
                    req.flash('password', password)
                    req.flash('username', username)
                    req.flash('role', role)
                    req.flash('role_post', role_post)
                    return res.redirect('/register')
                }
            })
        let hashed = bcrypt.hash(password, 10)
            .then(hashed => {

                let user = new User({
                    username: username,
                    password: hashed,
                    role: role,
                    role_post: role_post

                })
                return user.save().then(() => {
                    req.flash('error', 'Đăng kí thành công')
                    req.flash('password', password)
                    req.flash('username', username)
                    req.flash('role', role)
                    req.flash('role_post', role_post)
                    return res.redirect('/register')
                })

            })
    }
    else {
        result = result.mapped()
        let message
        for (m in result) {
            message = result[m].msg
            break
        }
        const { username, password, role, role_post } = req.body

        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        req.flash('role', role)
        req.flash('role_post', role_post)
        res.redirect('/register')
    }
})
export default Router;