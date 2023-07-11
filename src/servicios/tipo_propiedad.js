const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const tipo_propiedad = require("../models/model_tipo_propiedad");
const database = require('../database');
const{QueryTypes}=require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_tipo_propiedad');
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from tipo_propiedad order by descripcion asc',{type: QueryTypes.SELECT})
    .then((tipo_propiedades) =>{
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
                    body: tipo_propiedades
                })
            }
        })
    })
})


routes.get('/get/', async (req, res) => {
    
    await tipo_propiedad.findAll().then((tipo_propiedades) =>{
       res.json({
                    mensaje: "successfully",
                    body: tipo_propiedades
                })
    })
})

routes.get('/get/:idtipo_propiedad', verificaToken, async (req, res) => {
    await tipo_propiedad.findByPk(req.params.idtipo_propiedad).then((tipo_propiedades) =>{
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
                    body: tipo_propiedades
                })
            }
        })
    })
});

routes.post('/post/', verificaToken,validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await tipo_propiedad.create(req.body, {
            transaction: t
        }).then((tipo_propiedades)=>{
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
                        body: tipo_propiedades
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


routes.put('/put/:idtipo_propiedad', verificaToken,validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await tipo_propiedad.update(req.body, { where: { idtipo_propiedad: req.params.idtipo_propiedad } }, {
            transaction: t
        }).then((tipo_propiedades)=>{
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
                        body: tipo_propiedades
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

routes.delete('/del/:idtipo_propiedad', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        await tipo_propiedad.destroy({ where: { idtipo_propiedad: req.params.idtipo_propiedad } }, {
            transaction: t
        }).then((tipo_propiedades)=>{
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
                        body: tipo_propiedades
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