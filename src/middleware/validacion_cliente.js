const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCliente = [
    check('categoria').exists().not().isEmpty().withMessage('Favor cargar una categoria valida'), 
    check('estado').exists().not().isEmpty().withMessage('Favor cargar un estado'),
    check('idpersona').exists().not().isEmpty().withMessage('No hay una persona para este cliente'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCliente }