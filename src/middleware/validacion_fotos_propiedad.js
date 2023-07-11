const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('foto').exists().not().isEmpty().withMessage('Favor cargar una foto'), 
    check('estado').exists().not().isEmpty().withMessage('Favor cargar estado'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }