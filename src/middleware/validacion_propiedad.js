const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreate = [
    check('descripcion').exists().not().isEmpty().withMessage('Favor cargar una descripcion valida'), 
    check('direccion').exists().not().isEmpty().withMessage('Favor cargar una direccion'),
    check('superficie_terreno').exists().not().isEmpty().withMessage('Favor cargar superficie de terreno'),
    check('area_construida').exists().not().isEmpty().withMessage('Favor cargar el area construida'),
    check('precio').exists().not().isEmpty().withMessage('Favor cargar un precio'),
    check('dimencion').exists().not().isEmpty().withMessage('Favor cargar dimencion'),
    check('metros_c').exists().not().isEmpty().withMessage('Favor cargar metros cuadrados'),
    check('lat').exists().not().isEmpty().withMessage('Cargar ubicacion'),
    check('long').exists().not().isEmpty().withMessage('Cargar ubicacion'),
    //check('contacto_extra').exists().not().isEmpty().withMessage('Cargar un contacto'),
    //check('idpropiedad').exists().not().isEmpty().withMessage('Seleccione tipo de propiedad'),
    check('idvendedor').exists().not().isEmpty().withMessage('No se ha cargado vendedor'),
    //scheck('email').exists().not().isEmpty().isEmail().withMessage('Favor cargar un email valido'),
    (req,res,next) => {
        validateResult(req,res,next)
    }
]

module.exports ={ validateCreate }