const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('persona').exists().isObject(),
    check('persona.nombre').exists().not().isEmpty().withMessage('Favor cargar nombre'), 
    check('persona.apellido').exists().not().isEmpty().withMessage('Favor cargar un apellido'),
    check('persona.documento').exists().not().isEmpty().withMessage('Favor cargar documento'),
    //check('persona.direccion').exists().not().isEmpty().withMessage('Favor cargar direccion'),
    //check('persona.sexo').exists().not().isEmpty().withMessage('Favor cargar sexo'),
    //check('persona.fnacimiento').exists().not().isEmpty().withMessage('Favor cargar fecha de nacimiento'),
    //check('persona.nacionalidad').exists().not().isEmpty().withMessage('Favor cargar la nacionalidad'),
    check('persona.telefono').exists().not().isEmpty().withMessage('Favor cargar un numero de telefono'),
    check('persona.idbarrio').exists().not().isEmpty().withMessage('Seleccione barrio'),
    check('persona.correo').exists().not().isEmpty().isEmail().withMessage('Formato de correo invalido'),

    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }