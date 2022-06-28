const {check}=require('express-validator');

module.exports=[
    check('price')
    .exists().withMessage('Vui lòng nhập nhập giá trị đơn hàng')
    .notEmpty().withMessage('Giá đơn hàng không được phép để trống!!')
    .isNumeric().withMessage('Giá đơn hàng phải là kiểu số'),

    check('quantity')
    .exists().withMessage('Vui lòng nhập số lượng sản phẩm')
    .notEmpty().withMessage('Số lượng sản phẩm không được phép để trống!!')
    .isNumeric().withMessage('Số lượng sản phẩm phải là kiểu số'),

]