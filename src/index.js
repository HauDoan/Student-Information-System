import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import Post from './models/postModel.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import flash from 'express-flash'
import session from 'express-session'
import LoginRoute from './routes/login.js'
import { createClient } from 'redis';
import RedisStore from "connect-redis"

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

dotenv.config()
const redisURL = 'redis://localhost:6379';
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080

// Initialize client.
let redisClient = createClient({ url: redisURL })
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
    client: redisClient
})

app.set('view engine', 'ejs')
app.use(session({
    resave: false,
    rolling: false,
    saveUninitialized: false,
    secret: 'somesecret',
    cookie: { maxAge: 120000 },
    store: redisStore
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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('login')
})

app.all('*', (req, res) => {
    res.status(404).render('error');
})

app.listen(PORT, () => {
    console.log('http://localhost:' + PORT + '/login')
    console.log(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
        console.log('Connected to MongoDB')
    )
})