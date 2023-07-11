const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateUsuario = [
    check('usuario').exists().isObject(),
    check('usuario.usuario').exists().not().isEmpty().withMessage('Favor cargar un usuario valida'),
    check('usuario.password').exists().not().isEmpty().withMessage('Favor cargar una contraseña'),
    check('usuario.nivel').exists().not().isEmpty().withMessage('Favor cargar nivel'),
    check('usuario.idpersona').exists().not().isEmpty().withMessage('No se ha seleccionado una persona para este usuario'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    /*
    {
        "usuario":{
            "usuario":"testme",
            "password":"testme",
            "estado":"AC",
            "correo":"testme@test.com",
            "nivel":"1",
            "idpersona":"0"
        },
        "persona":{
            "nombre":"test",
            "apellido":"apellido",
            "estado":"AC",
            "telefono":"09xxxxxxxx",
            "correo":"testme@test.com",
            "documento":"-",
            "idbarrio":"1"
        }
    }
    */
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateLogin = [
    check('usuario').exists().not().isEmpty().withMessage('Favor cargar un usuario valida'),
    check('password').exists().not().isEmpty().withMessage('Favor cargar una contraseña'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateUsuario, validateLogin } 