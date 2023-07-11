const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const propiedad_has_documentos = require("../models/model_propiedad_has_documentos");
const database = require('../database');
const{QueryTypes}=require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_propiedad_has_documentos');
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from propiedad_has_documentos order by descripcion asc',{type: QueryTypes.SELECT})
    .then((propiedad_has_documentoses) =>{
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
                    body: propiedad_has_documentoses
                })
            }
        })
    })
})


routes.get('/get/', verificaToken, async (req, res) => {
    
    await propiedad_has_documentos.findAll().then((propiedad_has_documentoses) =>{
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
                    body: propiedad_has_documentoses
                })
            }
        })
    })
})

routes.get('/get/:idpropiedad_has_documentos', verificaToken, async (req, res) => {
    await propiedad_has_documentos.findByPk(req.params.idpropiedad_has_documentos).then((propiedad_has_documentoses) =>{
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
                    body: propiedad_has_documentoses
                })
            }
        })
    })
});

routes.post('/post/', verificaToken,validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await propiedad_has_documentos.create(req.body, {
            transaction: t
        }).then((propiedad_has_documentoses)=>{
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
                        detmensaje:"Registro almacenado satisfactoriamente",
                        authData: authData,
                        body: propiedad_has_documentoses
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


routes.put('/put/:idpropiedad_has_documentos', verificaToken,validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await propiedad_has_documentos.update(req.body, { where: { idpropiedad_has_documentos: req.params.idpropiedad_has_documentos } }, {
            transaction: t
        }).then((propiedad_has_documentoses)=>{
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
                        body: propiedad_has_documentoses
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

routes.delete('/del/:idpropiedad_has_documentos', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        await propiedad_has_documentos.destroy({ where: { idpropiedad_has_documentos: req.params.idpropiedad_has_documentos } }, {
            transaction: t
        }).then((propiedad_has_documentoses)=>{
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
                        body: propiedad_has_documentoses
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