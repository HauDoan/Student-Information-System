import express from 'express'
import User from '../models/accountModel.js'
import bcrypt from 'bcrypt'
import multer from 'multer'

const Router = express();
// Router.use(multer({dest:'uploads'}).single('image')); 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, filename + '-' + file.originalname)
    }
})
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({
    dest: 'uploads', fileFilter: (req, file, callback) => {
        // console.log(file)
        if (file.mimetype.startsWith('image/')) {
            callback(null, true)
        }
        else {
            callback(null, false)// ko cho phep upload

        }
    }, limits: 500000
})
Router.get('/', async (req, res) => {
    if (!req.cookies['auth']) {
        res.redirect('/login')
    }
    try {
        var auth = req.cookies['auth']
        var id = req.cookies['session-secret']
        if (auth === '0') {
            const user = await User.findById(id)
            res.render('info', { user, auth, error: "", lop: "", khoa: "", pwd: "", confirm_pwd: "" })
        }
        else {
            const user = await User.findById(id)
            res.render('info', { user, auth, error: "", lop: "", khoa: "", pwd: "", confirm_pwd: "" })
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
})


Router.post('/', async (req, res) => {
    if (!req.cookies['auth']) {
        return res.redirect('/login')
    }
    const acc = req.body
    var class1 = acc.class
    var password = acc.pwd
    var hash_password = bcrypt.hashSync("123456", 10)
    var auth = req.cookies['auth']
    var id = req.cookies['session-secret']
    const user = await User.findById(req.cookies['session-secret'])
    let error = ''
    let uploader = upload.single('image')
    uploader(req, res, err => {
        let { pwd, lop, khoa, confirm_pwd } = req.body

        let image = req.file
        // console.log('/'+image.filename)
        if (pwd.length > 0 && pwd.length < 6) {
            error = 'Mật khẩu mới phải có tối thiểu 6 kí tự'
        }
        else if (confirm_pwd !== pwd) {
            error = 'Mật khẩu xác nhận không đồng nhất'
        }
        if (error) {
            return res.render('info', { user, auth, error: error, lop: lop, khoa: khoa, pwd: pwd, confirm_pwd: confirm_pwd })
        }
        else {
            async function updateInfo(lop, khoa, pwd, id) {
                const user = await User.findById(id)
                if (pwd != '') {
                    var hash_password = bcrypt.hashSync(pwd, 10)
                    if (image) {
                        await user.updateOne({ class: lop, khoa: khoa, password: hash_password, avatar: '/' + image.filename })
                        const post = await Post.find({ email: user.email })
                        await Post.updateMany({ email: user.email }, { user: { name: user.name, avatar: "/" + image.filename, email: user.email } })
                            .then(function (err, data) {
                                try {
                                    console.log(data)
                                }
                                catch (err) {
                                    console.log(err)
                                    // throw err
                                }
                            })

                    }
                    else {
                        await user.updateOne({ class: lop, khoa: khoa, password: hash_password })
                    }
                }
                else {
                    if (image) {
                        await user.updateOne({ class: lop, khoa: khoa, avatar: '/' + image.filename })
                        const post = await Post.find({ email: user.email })
                        await Post.updateMany({ email: user.email }, { user: { name: user.name, avatar: "/" + image.filename, email: user.email } })
                            .then(function (err, data) {
                                try {
                                    console.log(data)
                                }
                                catch (err) {
                                    console.log(err)
                                }
                            })
                    }
                    else {
                        await user.updateOne({ class: lop, khoa: khoa })

                    }
                }
            }
            updateInfo(lop, khoa, pwd, id)
            return res.redirect('/info')

        }
    })
})

export default Router;