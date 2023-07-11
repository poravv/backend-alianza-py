const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('idpropiedad').exists().not().isEmpty().withMessage('No se ha seleccionado una propiedad'), 
    check('iddocumentos').exists().not().isEmpty().withMessage('Cargue una foto'), 
    check('estado').exists().not().isEmpty().withMessage('Favor cargar un estado'),
    check('foto').exists().not().isEmpty().withMessage('Favor cargar foto'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }