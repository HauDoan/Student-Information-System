require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cookie=require('cookie')
const User=require('./models/UserModel')
const Post= require('./models/PostModel')

const moment=require('moment')
var url=require('url')
//google Auth
const {OAuth2Client}=require('google-auth-library');
const client=new OAuth2Client(process.env.CLIENT_ID)
process.env.PWD = process.cwd()
const PORT=process.env.PORT || 8080
// const UserRoute=require('./routes/user')
const AuthRoute=require('./routes/auth')
const PostRoute=require('./routes/posts')
const PhongbanRoute=require('./routes/phongban')
const HomeRoute=require('./routes/home')
const loginValidator = require('./routes/validator/loginValidatator-admin')
const infoValidator= require('./routes/validator/infoValidator')
const MessageRoute=require('./routes/message')
const multer=require('multer')

const { validationResult } = require('express-validator')
const flash = require('express-flash')
const bcrypt=require('bcrypt')
const session = require('express-session')

const registerValidator = require('./routes/validator/registerValidator')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
      cb(null, 'uploads') 
    },
    filename: function (req, file, cb) {
      // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
      const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
      cb(null, filename + '-' + file.originalname )
    }
  })
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })
// const upload=multer({dest: 'uploads',fileFilter:(req,file,callback)=>
// {
//     // console.log(file)
//     if (file.mimetype.startsWith('image/'))
//     {
//         callback(null,true)
//     }
//     else 
//     {
//         callback(null,false)// ko cho phep upload

//     }
// },limits:500000})


const axios = require("axios");
var ThongbaoDB = require("./models/ThongbaoModel");


const AccountSchema = require('./models/Account')
// var database;
const app=express()
app.set('view engine','ejs')
// app.use(multer({dest:'uploads'}).single('image')); 


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
// app.use("/api/users",UserRoute)
app.use("/api/auth",AuthRoute)
app.use("/api/posts",PostRoute)
app.use("/api/phongban",PhongbanRoute)
app.use("/home",HomeRoute)
app.use('/message',MessageRoute)

app.use(express.static(__dirname + '/routes'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

app.use(express.static(__dirname + '/public/uploads'));
// app.use(express.static(__dirname + '/uploads'));






app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }
}));

app.use(flash());







app.get('/',(req,res)=>
{
})

app.get('/login',(req,res)=>
{

    var error1=req.query.err
    var error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const username = req.flash('username') || ''
    const auth=req.cookies['auth']
    if (!req.cookies['session-secret'])
    {
        if (error1==1)
        {
            error='Vui lòng sử dụng tài khoản email sinh viên để truy cập Website.'
            return res.render('login',{error, password, username})
        }
        else 
        {
            return res.render('login', {error, password, username})
        }
    }
    else 
    {
        if (auth==='1')
        {
            return res.redirect('/home/message')
        }
        else
        {
            return res.redirect('/home/index')
        }
    }

})

app.post('/login', loginValidator,async  (req, res) => {
    let result = validationResult(req)
    // console.log(result)
    let acc = req.body
    if (result.errors.length === 0 ){
        const {username, password} = req.body
        const acc= await  User.findOne({username: username})
        // console.log(User_check)
        .then(acc => {
            if (!acc) {
                req.flash('error', 'Tài khoản không tồn tại')
                req.flash('password', password)
                req.flash('username', username)
                return res.redirect('/login')
            }
            account = acc
            bcrypt.compare(password,acc.password).then(function(passwordMatch)
            {
            console.log(passwordMatch)
                if(passwordMatch===false){
                    req.flash('error', 'Sai username hoặc mật khẩu')
                    req.flash('password', password)
                    req.flash('username', username)
                    console.log("2")

                    // console.log(passwordMatch)
                     res.redirect('/login')
                }
                else 
                {
                    req.session.user = acc.username;    
                    const user= User.find({username: acc.username})
                    req.user=user
                    console.log("1")
                    res.cookie('auth','1')
                    res.cookie('session-secret',acc._id)
                    res.redirect('/home/index')
                }
                    
                
            })
        })     
    }
    else{
        result = result.mapped()
        let message
        for (m in result) {
            message = result[m].msg
            break
        }
        const{username, password} = req.body
    
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        res.redirect('/login')
    }
})

app.post('/login/google',(req,res)=>
{
    let token=req.body.token
    let user={}
    
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        user.email=payload.email
        user.picture=payload.picture
        user.name=payload.name
        console.log(payload)
      }
      verify()
      .then(async ()=>{

            if (user.email.includes("@student.tdtu.edu.vn"))
            {
                res.cookie('session-token',token)
            const userAccount=await User.findOne({email: user.email})
            if (!userAccount)
            {
                let khoa=''
                let khoa_check=user.email.charAt(0)
                if (khoa_check==="5")
                {
                     khoa="Công nghệ thông tin"
                }
                const user1=await new User({name: user.name,username:user.email,khoa:khoa , avatar: user.picture,email:user.email,posts:[]})
                user1.save()
                res.cookie('session-secret',user1._id.toString())
            }
            else 
            {
                res.cookie('session-secret',userAccount._id.toString())

            }
            res.cookie('auth','0')
            res.send('success')
            }
            else
            {

                res.send('Fail')
            }

      })
      .catch(console.error);
})
app.get('/info',async(req,res)=>
{
    if(!req.cookies['auth']){
         res.redirect('/login')
    }
    try 
    {
        var auth =req.cookies['auth']
        var id =req.cookies['session-secret']
        if (auth === '0')
        {
            // let user=req.user;
            const user=await User.findById(id)
            // checkAuthenticated()
            res.render('info',{user,auth,error:"",lop:"",khoa:"",pwd:"",confirm_pwd:""})
        }
        else 
        {
            const user=await User.findById(id)
            res.render('info',{user,auth,error:"",lop:"",khoa:"",pwd:"",confirm_pwd:""})
        }
      

    }
    catch(err)
    {
    res.status(400).json(err)

    }   
}
)
app.post('/info',async (req,res)=>
{

    if(!req.cookies['auth']){
        return  res.redirect('/login')
    }
    const acc=req.body
    var class1=acc.class
    var password=acc.pwd
    var hash_password=bcrypt.hashSync("123456",10)
    // console.log(req.body)
    // var khoa=acc.khoa
    var auth =req.cookies['auth']
    var id=req.cookies['session-secret']
    const user=await  User.findById(req.cookies['session-secret'])
    let error=''
    let uploader=upload.single('image')
      uploader(req,res,err=>
        {
        let {pwd,lop,khoa,confirm_pwd}=req.body

            let image=req.file
            // console.log('/'+image.filename)
            if  (pwd.length>0 && pwd.length<6)
            {
                error='Mật khẩu mới phải có tối thiểu 6 kí tự'
            }
            else if (confirm_pwd!==pwd)
            {
                error='Mật khẩu xác nhận không đồng nhất'
            }
            if (error)
            {
                return  res.render('info',{user,auth,error:error,lop:lop,khoa:khoa,pwd:pwd,confirm_pwd:confirm_pwd})
            }
            else 
            {
                async function updateInfo(lop,khoa,pwd,id)
                {
                    const user=await User.findById(id)
                    if (pwd!='')
                    {
                        var hash_password=bcrypt.hashSync(pwd,10)
                        if (image)
                        {
                            await user.updateOne({class:lop,khoa:khoa,password:hash_password,avatar:'/'+image.filename})
                            const post=await Post.find({email:user.email})
                            // await post.set({avatar:'/'+image.filename})
                            // console.log(post)
                            await Post.updateMany({email:user.email},{user:{name:user.name,avatar:"/"+image.filename,email:user.email}})
                            .then(function(err,data)
                            {
                                try
                                {
                                    console.log(data)
                                }
                                catch(err)
                                {
                                    console.log(err)
                                    // throw err
                                }
                            })

                        }
                        else 
                        {
                            await user.updateOne({class:lop,khoa:khoa,password:hash_password})
                        }
                    }
                    else 
                    {
                        if (image)
                        {
                            await user.updateOne({class:lop,khoa: khoa,avatar:'/'+image.filename})
                            const post=await Post.find({email:user.email})
                            // await post.updateMany({avatar:'/'+image.filename})
                            await Post.updateMany({email:user.email},{user:{name:user.name,avatar:"/"+image.filename,email:user.email}})
                            .then(function(err,data)
                            {
                                try
                                {
                                    console.log(data)
                                }
                                catch(err)
                                {
                                    console.log(err)
                                    // throw err
                                }
                            })


                            // console.log(post)

                        }
                        else 
                        {
                            await user.updateOne({class:lop,khoa: khoa})

                        }
                    }
                }   
                updateInfo(lop,khoa,pwd,id)
                return res.redirect('/info')
                
            }
        })

})
app.get('/home/index', async  (req,res)=>
{
    if(!req.cookies['auth']){
        return res.redirect('/login')
    }
    try 
    {
        var auth =req.cookies['auth']
        var id =req.cookies['session-secret']
        if (auth === '0')
        {
            // let user=req.user;
            const user=await User.findById(id)
            // checkAuthenticated()
            const postTimeline=await Post.find({}).sort({updatedAt: -1})
            return res.render('trangchu',{postTimeline,user,auth})
        }
        else 
        {
            const user=await User.findById(id)
            const postTimeline=await Post.find({}).sort({updatedAt: -1})
            return  res.render('trangchu',{postTimeline,user,auth})
        }
      

    }
    catch(err)
    {
        return  res.status(400).json(err)

    }   
})


app.get('/home/register', (req, res) => {
    if(!req.session.auth){
        return res.redirect('/login')
    }
    var auth =req.cookies['user']
    const error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const username = req.flash('username') || ''
    const role = req.flash('role') || ''
    const role_post = req.flash('role_post') || ''
    res.render('register', {error, password, username, role, role_post,auth})
})

app.post('/home/register', registerValidator, (req, res) => {
    if(!req.session.auth){
        return res.redirect('/login')
    }
    let result = validationResult(req)
    if(!req.session.user){
        return res.redirect('/login')
    }
    if(result.errors.length === 0 ){

        const {username, password, role, role_post} = req.body
        AccountSchema.findOne({username: username})
        .then(acc => {
            if (acc) {
                req.flash('error', 'Tài khoản này đã tồn tại (trùng username)')
                req.flash('password', password)
                req.flash('username', username)
                req.flash('role', role)
                req.flash('role_post', role_post)
                return res.redirect('/home/register')
            }
        })
        let hashed = bcrypt.hash(password, 10)
        .then(hashed =>{

            let user = new AccountSchema({
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
                return res.redirect('/home/register')
            })

        })
    }
    else{
        result = result.mapped()
        let message
        for (m in result) {
            message = result[m].msg
            break
        }
        const{username, password,role,role_post} = req.body
    
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        req.flash('role', role)
        req.flash('role_post', role_post)
        res.redirect('/home/register')
    }

   
    
})


app.get('/home/message', async  (req,res)=>
{
    if(!req.session.auth){
        return res.redirect('/login')
    }
    try 
    {
        if(!req.session.user){
            return res.redirect('/login')
        }
        var auth =req.cookies['user']
        let user=req.user;
        const postTimeline=await Post.find({}).sort({createdAt: -1})
        res.render('trangchu',{postTimeline,user,auth})
    }
    catch(err)
    {
    res.status(400).json(err)

    }   
})

app.get('/chitietthongbao/:id',async (req,res)=>
{
    if(!req.session.auth){
        return res.redirect('/login')
    }
    if(!req.session.user){
        return res.redirect('/login')
    }
    var id=req.params.id
    var auth =req.cookies['user']

    // console.log(id);
    let id1=req.cookies['session-secret']
    // const user = await User.findById(id1)
    const thongbaos=await ThongbaoDB.findById(id)
    console.log(thongbaos)
    res.render('chitietthongbao',{thongbaos,auth})
  

})

app.get('/home/thongbao', async (req,res)=>
{
    if(!req.session.auth){
        return res.redirect('/login')
    }
    try 
    {
        let id=req.cookies['session-secret']
        var auth =req.cookies['user']
        const thongbaos=await ThongbaoDB.find({})
        res.render('thongbao',{thongbaos,auth})
    }
    catch(err)
    {
    res.status(400).json(err)

    }   
})
// app.get('/')
app.get('/home/dangthongbao',async (req,res)=>
{
    if(!req.session.auth){
        return res.redirect('/login')
    }
    var id =req.cookies['session-secret']
    var auth =req.cookies['user']

    // const user =await User.findById(id)
    res.render('dangthongbao',{auth})
})


app.post('/home/dangthongbao',async (req,res)=>
{
    // var id =req.cookies['session-secret']
    if(!req.session.auth){
        return res.redirect('/login')
    }
    var auth =req.cookies['user']
    // const user =await AccountSchema.findById(id)
    let thongbaodb = new ThongbaoDB({
        title: req.body.title,
        text: req.body.text,
        user: req.body.name,
        createdAt: moment().format("DD/MM/YYYY HH:mm")

    })
    thongbaodb
        .save(thongbaodb)
        .then(data => {
            res.render('thongbao',{auth})
        })
    
})
app.get('/test',checkAuthenticated,(req,res)=>
{
    let user=req.user;
    res.cookie('auth','0')
    res.render('test',{user})

})

app.get('/home/thongbaokhoa',(req,res)=>
{
    res.render('thongbaokhoa')
})


app.get('/trangchu',(req,res)=>
{
    res.render('trangchu')
})
app.get('/logout',(req,res)=>
{
    res.clearCookie('session-token')
    res.clearCookie('auth')
    res.clearCookie('session-secret')
    res.redirect('login')
})
function checkAuthenticated(req,res,next)
{
    
    let token=req.cookies['session-token']

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
        const findAccount=await User.findOne({email: payload.email})

        if(!findAccount)
        {
            const Account= await new User({name:payload.name,email: payload.email, avatar: payload.picture, username: payload.email,posts: []})
            await Account.save();
        }
        // console.log('Tài khoản đã tồn tại!!!')

        // user.name=payload.name;
        user.email=payload.email;
        // user.picture=payload.picture;
        
       
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        // const id_session=user._id;
      }
      verify()
      .then(async ()=>{
        // const userAccount=await User.findOne({email: user.email})
            // res.cookie('session-secret',userAccount._id)
            res.cookie('user',0)
            
            // res.cookie('session-token',token)
            // res.send('success')
            // user.id=userAccount._id.toString();
            // req.user=userAccount;
            // req.session.user = userAccount.email;

            next();
      })
      .catch(err=>
      {
          console.log(err)
          res.redirect('/login')
      });
    
}

app.listen(PORT,()=> {
    console.log('http://localhost:'+PORT)
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>
    console.log('Connected to MongoDB')
)})