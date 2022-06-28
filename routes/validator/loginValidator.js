const {check}=require('express-validator');

module.exports=[
    check('email').exists().withMessage('Vui lòng nhập địa chỉ email')
    .notEmpty().withMessage('Địa chỉ email không được để trống!')
    .isEmail().withMessage('Địa chỉ email không hợp lệ!!!'),

    check('password')
    .exists().withMessage('Vui lòng nhập password')
    .notEmpty().withMessage('Password không được phép để trống!!'),


]