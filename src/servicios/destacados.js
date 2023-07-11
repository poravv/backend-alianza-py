const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const destacados = require("../models/model_destacados");
const database = require('../database');
const{QueryTypes}=require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_destacados');
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from destacados order by descripcion asc',{type: QueryTypes.SELECT})
    .then((destacadoses) =>{
        jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
            if (errorAuth) {
                res.json({
                    mensaje: "error",
                    error:errorAuth
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: destacadoses
                })
            }
        })
    })
})


routes.get('/get/', verificaToken, async (req, res) => {
    
    await destacados.findAll().then((destacadoses) =>{
        jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {

            if (errorAuth) {
                res.json({
                    mensaje: "error",
                    error:errorAuth
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: destacadoses
                })
            }
        })
    })
})

routes.get('/get/:iddestacados', verificaToken, async (req, res) => {
    await destacados.findByPk(req.params.iddestacados).then((destacadoses) =>{
        jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
            if (errorAuth) {
                res.json({
                    mensaje: "error",
                    detmensaje:"Error de autenticacion",
                    error:errorAuth
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: destacadoses
                })
            }
        })
    })
});

routes.post('/post/', verificaToken,validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await destacados.create(req.body, {
            transaction: t
        }).then((destacadoses)=>{
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if(!validateNivel({authData: authData})){
                    res.json({ 
                        mensaje:"error",
                        detmensaje: "No posee nivel para la creacion de registro"
                    });
                    return;
                };
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        detmensaje:"Error de autenticacion",
                        error:errorAuth
                    });
                } else {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje:"Registro almacenado satisfactoriamente",
                        authData: authData,
                        body: destacadoses
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error:error,
            detmensaje:"Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})


routes.put('/put/:iddestacados', verificaToken,validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await destacados.update(req.body, { where: { iddestacados: req.params.iddestacados } }, {
            transaction: t
        }).then((destacadoses)=>{
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if(!validateNivel({authData: authData})){
                    res.json({ 
                        mensaje:"error",
                        detmensaje: "No posee nivel para actualizar"
                    });
                    return;
                };
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        detmensaje:"Error de autenticacion",
                        error:errorAuth
                    });
                } else {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje:"Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: destacadoses
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error:error,
            detmensaje:"Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})

routes.delete('/del/:iddestacados', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        await destacados.destroy({ where: { iddestacados: req.params.iddestacados } }, {
            transaction: t
        }).then((destacadoses)=>{
            jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
                if(!validateNivel({authData: authData})){
                    res.json({
                        mensaje:"error",
                        detmensaje: "No posee nivel para actualizar"
                    });
                    return;
                };
                if (errorAuth) {
                    res.json({
                        mensaje: "error",
                        detmensaje:"Error de autenticacion",
                        error:errorAuth
                    });
                } else {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje:"Registro eliminado satisfactoriamente",
                        authData: authData,
                        body: destacadoses
                    });
                }
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error:error,
            detmensaje:"Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
        t.rollback();
    }
})

module.exports = routes;