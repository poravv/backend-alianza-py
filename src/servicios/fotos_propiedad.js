const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const fotos_propiedad = require("../models/model_fotos_propiedad");
const database = require('../database');
const { QueryTypes } = require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_fotos_propiedad')
const { validateNivel } = require('../middleware/validacion_nivel');
require("dotenv").config();
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const propiedad_has_fotos = require('../models/model_propiedad_has_fotos');


routes.get('/getsql/', verificaToken, async (req, res) => {
    await database.query('select * from fotos_propiedad order by descripcion asc', { type: QueryTypes.SELECT })
        .then((fotos_propiedades) => {
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
                        body: fotos_propiedades
                    })
                }
            })
        })
})


routes.get('/get/', verificaToken, async (req, res) => {

    await fotos_propiedad.findAll().then((fotos_propiedades) => {
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
                    body: fotos_propiedades
                })
            }
        })
    })
})

routes.get('/get/:idfotos_propiedad', verificaToken, async (req, res) => {
    await fotos_propiedad.findByPk(req.params.idfotos_propiedad).then((fotos_propiedades) => {
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
                    body: fotos_propiedades
                })
            }
        })
    })
});

routes.post('/post/', verificaToken, validateCreate, async (req, res) => {
    const t = await database.transaction();
    try {
        await fotos_propiedad.create(req.body, {
            transaction: t
        }).then((fotos_propiedades) => {
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
                        body: fotos_propiedades
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


routes.put('/put/:idfotos_propiedad', verificaToken, validateCreate, async (req, res) => {

    const t = await database.transaction();
    try {
        await fotos_propiedad.update(req.body, { where: { idfotos_propiedad: req.params.idfotos_propiedad } }, {
            transaction: t
        }).then((fotos_propiedades) => {
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
                        body: fotos_propiedades
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

routes.delete('/del/:idfotos_propiedad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        await fotos_propiedad.destroy({ where: { idfotos_propiedad: req.params.idfotos_propiedad } }, {
            transaction: t
        }).then((fotos_propiedades) => {
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
                        body: fotos_propiedades
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

// Configuración de multer para guardar las imágenes en una carpeta específica
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// Middleware para procesar la carga de archivos
const upload = multer({ storage: storage });




routes.post('/images/:idpropiedad', verificaToken, upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: 'No se ha seleccionado ninguna imagen' });
    }

    // Ruta relativa del archivo guardado
    const relativePath = req.file.path;
    //Ruta completa del archivo guardado
    //const absolutePath = path.join(__dirname, relativePath);

    const type = req.file.mimetype;
    //const name = relativePath;
    const name = req.file.filename
    const data = fs.readFileSync(path.join(__dirname, '../../uploads/' + req.file.filename))
    const t = await database.transaction();
    const tphf = await database.transaction();

    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (errorAuth, authData) => {
            if (!validateNivel({ authData: authData })) {
                res.json({
                    mensaje: "error",
                    detmensaje: "No posee nivel para crear"
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
                await fotos_propiedad.create({ estado: 'AC', type: type, name: name, data: data }, { transaction: t }).then(async (foto) => {
                    console.log(foto)
                    t.commit();
                    await propiedad_has_fotos.create({idpropiedad:req.params.idpropiedad,idfotos: foto.idfotos,estado:'AC'},{transaction:tphf }).then((phf) => {
                        tphf.commit();
                        res.json({
                            mensaje: "successfully",
                            detmensaje: "Registro almacenado satisfactoriamente",
                            authData: authData,
                            body: {
                                phf,
                                foto
                            }
                        });
                    })
                });
                
                
            }
        });
    } catch (error) {
        t.rollback();
        console.log('Error: ', error)
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });
    }
});


routes.delete('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('uploads/', filename);

    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo no existe');
            return res.status(404).json({ message: 'El archivo no existe' });
        }

        // Eliminar el archivo
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo', err);
                return res.status(500).json({ message: 'Error al eliminar el archivo' });
            }

            console.log('Archivo eliminado correctamente');
            return res.status(200).json({ message: 'Archivo eliminado correctamente' });
        });
    });
});

module.exports = routes;