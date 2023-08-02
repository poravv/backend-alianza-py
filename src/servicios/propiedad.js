const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const propiedad = require("../models/model_propiedad");
const vw_destacados = require("../models/model_vw_destacados");
const database = require('../database');
const { QueryTypes } = require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_propiedad');
const { validateNivel } = require('../middleware/validacion_nivel');
const vw_propiedad = require('../models/model_vw_propiedad');
const propiedad_has_fotos = require('../models/model_propiedad_has_fotos');
const fotos_propiedad = require('../models/model_fotos_propiedad');
const barrio = require('../models/model_barrio');
require("dotenv").config();

routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from vw_destacados', { type: QueryTypes.SELECT })
        .then((propiedades) => {
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        error: errorAuth
                    });
                } else {
                    res.json({
                        mensaje: "successfully",
                        authData: authData,
                        body: propiedades
                    })
                }
            })
        })
})

routes.get('/getDestacados/', async (req, res) => {
    try {
        await vw_destacados.findAll({
            include: [
                {
                    model: propiedad_has_fotos, include: [
                        { model: fotos_propiedad },
                    ]
                },
            ]
        }).then((propiedades) => {
                res.json({
                    mensaje: "successfully",
                    body: propiedades
                });
            })
    } catch (error) {
        console.log(error);
        res.json({
            mensaje: "error",
            error: error
        });
    }
})


routes.get('/getviewtt/', async (req, res) => {
    try {
        await vw_propiedad.findAll({
            include: [
                {
                    model: propiedad_has_fotos, include: [
                        { model: fotos_propiedad },
                    ]
                },
            ]
        })
            .then((propiedades) => {
                res.json({
                    mensaje: "successfully",
                    body: propiedades
                });
            })
    } catch (error) {
        console.log(error);
        res.json({
            mensaje: "error",
            error: error
        });
    }
})

routes.get('/getview/:idvendedor', verificaToken, async (req, res) => {
    //console.log('-----------------',req.params.idusuario)
    await vw_propiedad.findAll({
        where: { idvendedor: req.params.idvendedor }, include: [
            {
                model: propiedad_has_fotos, include: [
                    { model: fotos_propiedad },
                ],
            },
        ]
    })
        .then((propiedades) => {
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        error: errorAuth
                    });
                } else {
                    res.json({
                        mensaje: "successfully",
                        authData: authData,
                        body: propiedades
                    })
                }
            })
        })
})

routes.get('/get/', async (req, res) => {

    await propiedad.findAll({
        include: [
            { model: barrio },
            //{ model: vendedor,include:[{ model: usuario, include:[{model:persona}] }] }
        ]
    }).then((propiedades) => {
        res.json({
            mensaje: "successfully",
            body: propiedades
        });
    })
})

routes.get('/get/:idpropiedad', verificaToken, async (req, res) => {
    await propiedad.findOne({
        where: { idpropiedad: req.params.idpropiedad },
        include: [
            { model: barrio },
            //{ model: vendedor,include:[{ model: usuario, include:[{model:persona}] }] }
        ]
    }).then((propiedades) => {
        jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
            if (errorAuth) {
                res.json({
                    mensaje: "error",
                    detmensaje: "Error de autenticacion",
                    error: errorAuth
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: propiedades
                })
            }
        })
    })
});

routes.post('/post/', verificaToken, validateCreate, async (req, res) => {
    const t = await database.transaction();
    //console.log(req.body)
    try {
        await propiedad.create(req.body, {
            transaction: t
        }).then((propiedades) => {
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                console.log('Entra en jwt')
                if (!validateNivel({ authData: authData })) {
                    console.log('Entra en validacion nivel')
                    res.json({
                        mensaje: "error",
                        detmensaje: "No posee nivel para actualizar"
                    });
                    return;
                };
                if (errorAuth) {
                    console.log('Entra en errorAuth')
                    res.json({
                        mensaje: "error",
                        detmensaje: "Error de autenticacion",
                        error: errorAuth
                    });
                    return;
                } else {
                    console.log('Entra en commit: ', propiedades)
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro almacenado satisfactoriamente",
                        authData: authData,
                        body: propiedades
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})


routes.put('/put/:idpropiedad', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {
        await propiedad.update(req.body, { where: { idpropiedad: req.params.idpropiedad } }, {
            transaction: t
        }).then((prop) => {
            
            console.log(prop)

            jwt.verify(req.token, process.env.CLAVESECRETA, async (errorAuth, authData) => {
                if (!validateNivel({ authData: authData })) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "No posee nivel para actualizar"
                    });
                    return;
                };
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "Error de autenticacion",
                        error: errorAuth
                    });
                } else {
                    t.commit();
                    const propiedad_upd = await propiedad.findOne({
                        where: { idpropiedad: req.params.idpropiedad },
                        include: [
                            {
                                model: barrio
                            },
                            //{ model: vendedor,include:[{ model: usuario, include:[{model:persona}] }] }
                        ]
                    });
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: propiedad_upd
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})

routes.delete('/del/:idpropiedad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        await propiedad.destroy({ where: { idpropiedad: req.params.idpropiedad } }, {
            transaction: t
        }).then((propiedades) => {
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if (!validateNivel({ authData: authData })) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "No posee nivel para actualizar"
                    });
                    return;
                };
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "Error de autenticacion",
                        error: errorAuth
                    });
                } else {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro eliminado satisfactoriamente",
                        authData: authData,
                        body: propiedades
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})

module.exports = routes;