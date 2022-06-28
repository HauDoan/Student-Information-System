const {check}=require('express-validator');

module.exports=[
    check('name').exists().withMessage('Vui lòng nhập tên sản phẩm')
    .notEmpty().withMessage('Tên sản phẩm không được để trống!!'),

    check('price')
    .exists().withMessage('Vui lòng nhập nhập giá sản phẩm')
    .notEmpty().withMessage('Giá sản phẩm không được phép để trống!!')
    .isNumeric().withMessage('Giá sản phẩm phải là kiểu số'),

    check('desc')
    .exists().withMessage('Vui lòng nhập mô tả sản phẩm')
    .notEmpty().withMessage('Mô tả sản phẩm không được phép để trống!!')

]