import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import Post from './models/postModel.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routes
import AuthRoute from './routes/auth.js'
import PostRoute from './routes/posts.js'
import DepartmentRoute from './routes/department.js'
import HomeRoute from './routes/home.js'
import MessageRoute from './routes/message.js'
import InfoRoute from './routes/info.js'
import RegisterAccountRoute from './routes/registerAccDepartment.js'
import NotificationRoute from './routes/notifications.js'
import NotifyRoute from './routes/notify.js'

import flash from 'express-flash'
import session from 'express-session'
import ThongbaoDB from "./models/notificationModel.js";
import LoginRoute from './routes/login.js'
import connectRedis from 'connect-redis';
// const RedisStore = new connectRedis(session);

// const redisClient = createClient({
//     url: 'redis://localhost:9090', // Adjust the URL as necessary
// });

// redisClient.on('error', (err) => {
//     console.error('Redis Client Error', err);
// });

// Connect to Redis
// await redisClient.connect().catch(console.error);
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080
process.env.PWD = process.cwd()
app.set('view engine', 'ejs')
app.use(session({
    resave: false,
    rolling: false,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
    // store: RedisStore({ client: redisClient })
}));
app.use(flash());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/routes'));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/utils'));
app.use(express.static(__dirname + '/../public/uploads'));

// API
app.use("/api/auth", AuthRoute)
app.use("/api/posts", PostRoute)
app.use("/api/department", DepartmentRoute)

// Routes
app.use("/", HomeRoute)
app.use("/register", RegisterAccountRoute)
app.use('/message', MessageRoute)
app.use('/login', LoginRoute, flash)
app.use('/info', InfoRoute)
app.use('/notifications', NotificationRoute)
app.use('/notify', NotifyRoute)

app.get('/message', async (req, res) => {
    if (!req.cookies['auth']) {
        return res.redirect('/login')
    }
    try {
        if (!req.session.user) {
            return res.redirect('/login')
        }
        var auth = req.cookies['user']
        let user = req.user;
        const postTimeline = await Post.find({}).sort({ createdAt: -1 })
        res.render('home', { postTimeline, user, auth })
    }
    catch (err) {
        res.status(400).json(err)
    }
})

app.get('/chitietthongbao/:id', async (req, res) => {
    if (!req.cookies['auth']) {
        return res.redirect('/login')
    }
    var id = req.params.id
    var auth = req.cookies['user']
    const thongbaos = await ThongbaoDB.findById(id)
    res.render('chitietthongbao', { thongbaos, auth })
})

app.get('/logout', (req, res) => {
    res.clearCookie('session-token')
    res.clearCookie('auth')
    res.clearCookie('session-secret')
    res.redirect('login')
})

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT + '/login')
    console.log(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
        console.log('Connected to MongoDB')
    )
})