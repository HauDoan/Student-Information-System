import mongoose from 'mongoose'
import router from 'express'

const route = router.Router()
route.get("/", (req, res) => {
    res.send("Auth Route")
})
export default route
