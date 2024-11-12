import express from 'express'
import loginValidatator from '../validator/loginValidatator-admin.js';
import { validationResult } from 'express-validator'
import User from '../models/accountModel.js'
import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library';
//google Auth
const client = new OAuth2Client(process.env.CLIENT_ID)
const Router = express();

Router.get('/', (req, res) => {
    var error1 = req.query.err
    var error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const username = req.flash('username') || ''
    if (!req.session.key) {
        if (error1 == 1) {
            error = 'Vui lòng sử dụng tài khoản email sinh viên để truy cập Website.'
            return res.render('login', { error, password, username })
        }
        else {
            return res.render('login', { error, password, username })
        }
    }
    return res.redirect('/')
})

Router.post('/', loginValidatator, async (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const { username, password } = req.body
        await User.findOne({ username: username })
            .then(acc => {
                if (!acc) {
                    req.flash('error', 'Tài khoản không tồn tại')
                    req.flash('password', password)
                    req.flash('username', username)
                    return res.redirect('/login')
                }
                bcrypt.compare(password, acc.password).then(async function (passwordMatch) {
                    if (passwordMatch === false) {
                        req.flash('error', 'Sai username hoặc mật khẩu')
                        req.flash('password', password)
                        req.flash('username', username)
                        res.redirect('/login')
                    }
                    else {
                        req.session.key = acc._id
                        res.redirect('/')
                    }
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
        const { username, password } = req.body
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        res.redirect('/login')
    }
})

Router.post('/login/google', (req, res) => {
    let token = req.body.token
    let user = {}

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        user.email = payload.email
        user.picture = payload.picture
        user.name = payload.name
    }
    verify()
        .then(async () => {

            if (user.email.includes("@student.tdtu.edu.vn")) {
                res.cookie('session-token', token)
                const userAccount = await User.findOne({ email: user.email })
                if (!userAccount) {
                    let khoa = ''
                    let khoa_check = user.email.charAt(0)
                    if (khoa_check === "5") {
                        khoa = "Công nghệ thông tin"
                    }
                    const user1 = await new User({ name: user.name, username: user.email, khoa: khoa, avatar: user.picture, email: user.email, posts: [] })
                    user1.save()
                }
                else {
                }
            }
            else {
                res.send('Fail')
            }

        })
        .catch(console.error);
})

function checkAuthenticated(req, res, next) {

    let token = req.session.key

    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        // console.log(payload)
        const findAccount = await User.findOne({ email: payload.email })

        if (!findAccount) {
            const Account = await new User({ name: payload.name, email: payload.email, avatar: payload.picture, username: payload.email, posts: [] })
            await Account.save();
        }
        // console.log('Tài khoản đã tồn tại!!!')

        // user.name=payload.name;
        user.email = payload.email;
        // user.picture=payload.picture;


        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        // const id_session=user._id;
    }
    verify()
        .then(async () => {
            // const userAccount=await User.findOne({email: user.email})
            // res.cookie('session-secret',userAccount._id)
            res.cookie('user', 0)

            // res.cookie('session-token',token)
            // res.send('success')
            // user.id=userAccount._id.toString();
            // req.user=userAccount;
            // req.session.user = userAccount.email;

            next();
        })
        .catch(err => {
            console.log(err)
            res.redirect('/login')
        });

}
export default Router;