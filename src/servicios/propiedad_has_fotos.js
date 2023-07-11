const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const propiedad_has_fotos = require("../models/model_propiedad_has_fotos");
const database = require('../database');
const { QueryTypes } = require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_propiedad_has_fotos');
const { validateNivel } = require('../middleware/validacion_nivel');
const fotos_propiedad = require('../models/model_fotos_propiedad');
require("dotenv").config();
const fs = require('fs');
const path = require('path')


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from propiedad_has_fotos order by descripcion asc', { type: QueryTypes.SELECT })
        .then((propiedad_has_fotos) => {
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
                        body: propiedad_has_fotos
                    })
                }
            })
        })
})


routes.get('/get/', verificaToken, async (req, res) => {

    await propiedad_has_fotos.findAll().then((propiedad_has_fotos) => {
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
                    body: propiedad_has_fotos
                })
            }
        })
    })
})

routes.get('/get/:idpropiedad', verificaToken, async (req, res) => {
    await propiedad_has_fotos.findAll({ where: { idpropiedad: req.params.idpropiedad }, include: [{ model: fotos_propiedad }] },).then((propiedad_has_fotos) => {
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
                    body: propiedad_has_fotos
                })
            }
        })
    })
});

routes.post('/post/', verificaToken, validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await propiedad_has_fotos.create(req.body, {
            transaction: t
        }).then((propiedad_has_fotos) => {
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
                        body: propiedad_has_fotos
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


routes.put('/put/:idpropiedad', verificaToken, validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await propiedad_has_fotos.update(req.body, { where: { idpropiedad: req.params.idpropiedad } }, {
            transaction: t
        }).then((propiedad_has_fotos) => {
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
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: propiedad_has_fotos
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

const eliminaArchivo = ({filename}) => {
    const filePath = path.join('uploads/', filename);

    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo no existe');
            //return res.status(404).json({ message: 'El archivo no existe' });
            return;
        }

        // Eliminar el archivo
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo', err);
                //return res.status(500).json({ message: 'Error al eliminar el archivo' });
                return;
            }

            console.log('Archivo eliminado correctamente');
            //return res.status(200).json({ message: 'Archivo eliminado correctamente' });
            return;
        });
    });
}

routes.delete('/del/:idfotos/:filename', verificaToken, async (req, res) => {

    const t = await database.transaction();
    const tpf = await database.transaction();

    try {
        await propiedad_has_fotos.destroy({ where: { idfotos: req.params.idfotos } }, {
            transaction: t
        }).then((propiedad_has_fotos) => {
            jwt.verify(req.token, process.env.CLAVESECRETA, async (errorAuth, authData) => {
                if (!validateNivel({ authData: authData })) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "No posee nivel para borrar"
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
                    await fotos_propiedad.destroy({ where: { idfotos: req.params.idfotos } }, {
                        transaction: tpf
                    }).then((del) => { 
                        tpf.commit();
                        console.log('delete: ',del)

                        eliminaArchivo({filename:req.params.filename});

                        res.json({
                            mensaje: "successfully",
                            detmensaje: "Registro eliminado satisfactoriamente",
                            authData: authData,
                            body: propiedad_has_fotos
                        });
                    })
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