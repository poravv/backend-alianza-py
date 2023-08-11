const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const vendedor = require("../models/model_vendedor");
const vw_vendedor = require("../models/model_vw_vendedores");
const database = require('../database');
const{QueryTypes}=require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_vendedor')
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from vendedor order by descripcion asc',{type: QueryTypes.SELECT})
    .then((vendedores) =>{
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
                    body: vendedores
                });
            }
        })
    })
})


routes.get('/get/', async (req, res) => {
    await vendedor.findAll().then((vendedores) =>{
        res.json({
            mensaje: "successfully",
            body: vendedores
        });
    });
});

routes.get('/getvw/', async (req, res) => {
    await vw_vendedor.findAll().then((vendedores) =>{
        res.json({
            mensaje: "successfully",
            body: vendedores
        });
    });
});

routes.get('/get/:idvendedor', verificaToken, async (req, res) => {
    await vendedor.findByPk(req.params.idvendedor).then((vendedores) =>{
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
                    body: vendedores
                })
            }
        })
    })
});

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        await vendedor.create(req.body, {
            transaction: t
        }).then((vendedores)=>{
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
                        body: vendedores
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


routes.put('/put/:idvendedor', verificaToken,validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await vendedor.update(req.body, { where: { idvendedor: req.params.idvendedor } }, {
            transaction: t
        }).then((vendedores)=>{
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
                        body: vendedores
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

routes.delete('/del/:idvendedor', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        await vendedor.destroy({ where: { idvendedor: req.params.idvendedor } }, {
            transaction: t
        }).then((vendedores)=>{
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
                        body: vendedores
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