const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const persona = require("../models/model_persona");
const barrio = require("../models/model_barrio")
const database = require('../database');
const { QueryTypes } = require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_persona');
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from persona order by descripcion asc', { type: QueryTypes.SELECT })
        .then((per) => {
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
                        body: per
                    })
                }
            })
        })
})


routes.get('/get/', verificaToken, async (req, res) => {

    await persona.findAll().then((per) => {
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
                    body: per
                })
            }
        })
    })
})

routes.get('/get/:idpersona', verificaToken, async (req, res) => {
    await persona.findByPk(req.params.idpersona).then((per) => {
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
                    body: per
                })
            }
        })
    })
});

routes.get('/get_doc/:documento', verificaToken, async (req, res) => {
    await persona.findOne({ where: { documento: req.params.documento },include: [
        { model: barrio }
    ] }).then((per) => {
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
                    body: per
                })
            }
        })
    })
});

routes.post('/post/', verificaToken, validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await persona.create(req.body, {
            transaction: t
        }).then((per) => {
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
                        detmensaje: "Registro almacenado satisfactoriamente",
                        authData: authData,
                        body: per
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


routes.put('/put/:idpersona', verificaToken, validateCreate, async (req, res) => {
    console.log(req.body)
    const t = await database.transaction();
    try {
        await persona.update(req.body.persona, { where: { idpersona: req.params.idpersona } }, {
            transaction: t
        }).then((per) => {
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
                    return;
                } else {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: per
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

routes.delete('/del/:idpersona', verificaToken, async (req, res) => {

    const t = await database.transaction();

    try {
        await persona.destroy({ where: { idpersona: req.params.idpersona } }, {
            transaction: t
        }).then((per) => {
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
                        body: per
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