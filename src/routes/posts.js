
import express from 'express'
import multer from 'multer'
import moment from 'moment'
import Post from '../models/postModel.js'
import User from '../models/accountModel.js'

const Router = express()
// const upload=multer({fileFilter: (req,file,callback)=>{

//     // console.log(file)
//     if (file.mimetype.startsWith('image/'))
//     {
//         callback(null,'uploads')
//     }
//     else 
//     {
//         callback(null,false)
//     }

//     // callback(null,true)
// },limits:{fileSize:500000}})
// // const a=require('')
import postController from '../controller/postController.js'

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
//       cb(null, 'uploads') 
//     },
//     filename: function (req, file, cb) {
//       // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
//       const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
//       cb(null, filename + '-' + file.originalname )
//     }
//   })
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({
    // storage: multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, 'uploads');
    //     },
    //     filename: (req, file, cb) => {
    //         const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //         cb(null, filename + '-' + file.originalname);
    //     }
    // })
    dest: 'uploads/'
});

Router.use(express.urlencoded({ extended: true }))
Router.get("/", postController.post_index)
//create post 
Router.post("/", async (req, res) => {
    const id = req.cookies['session-secret']
    const user = await User.findById(id)
    let uploader = upload.single('image')
    uploader(req, res, err => {
        let image = req.file
        let post = req.body
        if (!image) {
            const newPost = new Post({ description: post.description, user: { name: user.name, avatar: user.avatar, email: user.email }, thumbnail: '', video: post.video, createdAt: moment().format('lll'), comments: [] })
            newPost.save();
            res.send({ 'data': newPost })
        }
        else if (err) {
            res.end(err)
        }
        else {
            let path = image.path;
            const newPost = new Post({ description: post.description, user: { name: user.name, avatar: user.avatar, email: user.email }, thumbnail: path.slice(7), video: post.video, createdAt: moment().format('lll'), comments: [], updatedAt: new Date() })
            newPost.save();
            res.send({ 'data': newPost })
        }

    })



})
//update post User 
Router.post("/update/:id", async (req, res) => {
    var idPost = req.params.id
    const idUser = req.cookies['session-secret']
    const newPost = await Post.findById(idPost)
    const user = await User.findById(idUser)
    await user.updateOne({ $push: { posts: newPost } })
    res.send('successful')
})


//update post
Router.put("/:id", postController.update_post)
//delete post
Router.delete("/:id", postController.delete_post)
//like and dislike post
Router.put("/:id/like", postController.like_post)
//get post 
Router.get("/:id", postController.get_post)
// get timeline post 
Router.get("/timeline/all", postController.post_timeline)
export default Router
