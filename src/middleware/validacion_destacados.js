const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('idpropiedad').exists().not().isEmpty().withMessage('Favor seleccionar una propiedad'), 
    check('estado').exists().not().isEmpty().withMessage('Favor cargar un estado'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }