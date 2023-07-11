const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const barrio = require("../models/model_barrio");
const database = require('../database');
const{QueryTypes}=require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_barrio')
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from barrio order by descripcion asc',{type: QueryTypes.SELECT})
    .then((barrioes) =>{
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
                    body: barrioes
                })
            }
        })
    })
})


routes.get('/get/', verificaToken, async (req, res) => {
    
    await barrio.findAll().then((barrioes) =>{
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
                    body: barrioes
                })
            }
        })
    })
})

routes.get('/get/:idciudad', async (req, res) => {
    await barrio.findAll({where:{idciudad:req.params.idciudad}}).then((barrioes) =>{
        res.json({
            mensaje: "successfully",
            body: barrioes
        })
    })
});

routes.post('/post/', verificaToken,validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await barrio.create(req.body, {
            transaction: t
        }).then((barrioes)=>{
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
                        body: barrioes
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


routes.put('/put/:idbarrio', verificaToken,validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await barrio.update(req.body, { where: { idbarrio: req.params.idbarrio } }, {
            transaction: t
        }).then((barrioes)=>{
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
                        body: barrioes
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

routes.delete('/del/:idbarrio', verificaToken, async (req, res) => {
    const t = await  database.transaction();
    try {
        await barrio.destroy({ where: { idbarrio: req.params.idbarrio } }, {
            transaction: t
        }).then((barrioes)=>{
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
                        body: barrioes
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