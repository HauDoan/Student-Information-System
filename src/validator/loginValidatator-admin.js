import validator  from 'express-validator'
const {check} = validator;

export default [
    check('username')
    .exists().withMessage('Vui lòng nhập username')
    .isLength({min: 6}).withMessage('Username phải có tối thiểu 6 ký tự')
    .notEmpty().withMessage('Username không được để trống'),

    check('password')
    .exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({min: 6}).withMessage('Mật khẩu phải có tối thiểu 6 ký tự'),
]
