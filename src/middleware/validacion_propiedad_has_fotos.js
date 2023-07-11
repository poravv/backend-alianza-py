const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('idpropiedad').exists().not().isEmpty().withMessage('No se ha seleccionado una propiedad'), 
    check('idfotos').exists().not().isEmpty().withMessage('Cargue una foto'), 
    check('estado').exists().not().isEmpty().withMessage('Favor cargar un estado'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }