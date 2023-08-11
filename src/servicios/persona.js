const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const persona = require("../models/model_persona");
const barrio = require("../models/model_barrio")
const vw_personas = require("../models/model_vw_personas")
const database = require('../database');
const { QueryTypes } = require("sequelize");
const verificaToken = require('../middleware/token_extractor');
const { validateCreate } = require('../middleware/validacion_persona');
const { validateNivel } = require('../middleware/validacion_nivel');
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const vw_persona_usuario = require('../models/model_vw_persona_usuario');
require("dotenv").config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

routes.get('/getvw/', verificaToken, async (req, res) => {
    
    const rspersonas = await vw_personas.findAll();
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});;
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: rspersonas
            })
        }
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
    await persona.findOne({
        where: { documento: req.params.documento }, include: [
            { model: barrio }
        ]
    }).then((per) => {
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

routes.get('/likePersona/:documento', verificaToken, async (req, res) => {
    const rspersonas = await vw_persona_usuario.findAll({where:{
        documento: {
            [Op.like]: `${req.params.documento}%`
          }
    }})
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});;
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: rspersonas
            });
        }
    })
})

routes.post('/post/', verificaToken, validateCreate, async (req, res) => {
    const t = await database.transaction();
    console.log(req.body)
    try {
        await persona.create(req.body.persona, {
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

routes.post('/postper/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    //console.log(req.body)
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
    const t = await database.transaction();
    try {
        await persona.update(req.body.persona, { where: { idpersona: req.params.idpersona } }, {
            transaction: t
        }).then((per) => {
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
                    return;
                } else {
                    t.commit();
                    const persona_upd = await persona.findByPk(req.params.idpersona)
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: persona_upd
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


routes.put('/putper/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    console.log(req.body)
    console.log(req.body)
    try {
        await persona.update(req.body, { where: { idpersona: req.params.idpersona } }, {
            transaction: t
        }).then((per) => {
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
                    return;
                } else {
                    t.commit();
                    const persona_upd = await persona.findByPk(req.params.idpersona)
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: persona_upd
                    });
                }
            });
        });
    } catch (error) {
        console.log(error)
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

routes.post('/perfil/:idpersona', verificaToken, upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: 'No se ha seleccionado ninguna imagen' });
    }

    const relativePath = req.file.path;
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
                await persona.update({ photo: name }, { where: { idpersona: req.params.idpersona } }, {
                    transaction: t
                }).then((per) => {
                    t.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro actualizado satisfactoriamente",
                        authData: authData,
                        body: per
                    });
                })

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


const eliminaArchivo = ({ filename }) => {
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

routes.delete('/perfil/:idpersona/:filename', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        await persona.update({ photo: null }, { where: { idpersona: req.params.idpersona } }, {
            transaction: t
        }).then((per) => {
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
                }
                t.commit();
                eliminaArchivo({ filename: req.params.filename });
                persona.findByPk(req.params.idpersona).then((person)=>{
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro eliminado satisfactoriamente",
                        authData: authData,
                        body: person
                    });
                })
            });
        })
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