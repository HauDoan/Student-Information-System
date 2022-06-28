const {check} = require('express-validator')


module.exports = [

    check('pwd')
    // .exists().withMessage('Vui lòng nhập mật khẩu')
    // .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({min:6}).withMessage('Mật khẩu phải có tối thiểu 6 ký tự'),
    


    check('confirm_pwd')
    // .exists().withMessage('Vui lòng nhập mật khẩu')
    // .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({min:6}).withMessage('Mật khẩu phải có tối thiểu 6 ký tự'),

]
