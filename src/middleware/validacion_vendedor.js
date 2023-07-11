const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('fb').exists().not().isEmpty().withMessage('Favor cargar una descripcion valida'), 
    check('inst').exists().not().isEmpty().withMessage('Favor cargar un estado'),
    check('telefono').exists().not().isEmpty().withMessage('Favor cargar un telefono'),
    check('idpersona').exists().not().isEmpty().withMessage('Favor seleccionar una persona para este vendedor'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }