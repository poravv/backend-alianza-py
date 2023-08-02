const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const usuariomodel = require("../models/model_usuario")
const barrio = require("../models/model_barrio")
const vendedor = require("../models/model_vendedor")
const persona = require("../models/model_persona")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
const { validateUsuario, validateLogin } = require('../middleware/validacion_usuario');
const { validateCreate } = require('../middleware/validacion_persona');
const { validateNivel } = require('../middleware/validacion_nivel');
const md5 = require('md5');
const usuario = require('../models/model_usuario');
require("dotenv").config()

routes.post('/login/', validateLogin, async (req, res) => {
    try {
        const { usuario, password } = req.body;
        await usuariomodel.findOne(
            {
                where: { usuario: usuario, password: md5(password) },
                include: [
                    {
                        model: persona, include: [
                            { model: barrio },
                        ]
                    },
                    { model: vendedor },
                ]
            }).then((usuario) => {
                if (usuario.length != 0) {
                    jwt.sign({ usuario }, process.env.CLAVESECRETA
                        , { expiresIn: '12h' }//Para personalizar el tiempo para expirar
                        , (error, token) => {
                            res.json({
                                mensaje: "successfully",
                                token,
                                body: usuario
                            });
                        });
                } else {
                    res.status(400).json(
                        {
                            mensaje: "error",
                            detmensaje: "Usuario no existe"
                        }
                    );
                }
            })
    } catch (error) {
        res.status(400).json(
            {
                mensaje: "error",
                detmensaje: "Error de acceso, favor contacte con el administrador"
            }
        );
    }
});

routes.get('/get/', verificaToken, async (req, res) => {
    await usuariomodel.findAll({
        include: [
            { model: persona, include: [{ model: barrio }, ] },
            { model: vendedor },
        ]
    }).then((usuarios) => {
        jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
            if (errorAuth) {
                res.json({
                    mensaje: "error",
                    detmensaje: "Error de autenticacion, vuelva a iniciar la sesion, sino, contacte con el administrador",
                    errorAuth
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: usuarios
                })
            }
        })
    })


})

routes.get('/get/:idusuario', verificaToken, async (req, res) => {
    const usuarios = await usuariomodel.findByPk(req.params.idusuario, {
        include: [

            { model: persona, include: [{ model: barrio },] },
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (errorAuth, authData) => {
        if (errorAuth) {
            res.json({
                mensaje: "error",
                detmensaje: "Error de autenticacion, vuelva a iniciar la sesion, sino, contacte con el administrador",
                error: errorAuth
            });
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: usuarios
            })
        }
    })
})

routes.post('/post/', validateCreate, validateUsuario, async (req, res) => {
    const tusu = await database.transaction();
    const tper = await database.transaction();
    try {
        req.body.usuario.password = md5(req.body.usuario.password);
        jwt.verify(req.token, process.env.CLAVESECRETA, async (errorAuth, authData) => {
            if (errorAuth) {
                //Logica para los que no tienen token
                req.body.usuario.nivel = 3;
            } else {
                //Logica para los que si tienen token
                if (!validateNivel({ authData: authData })) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "No posee nivel para crear usuario"
                    });
                    return;
                };
            }
            await persona.create(req.body.persona, { transaction: tper }).then(async (per) => {
                tper.commit();
                req.body.usuario.idpersona = per.idpersona;
                console.log(per);

                await usuariomodel.create(req.body.usuario, { transaction: tusu }).then((user) => {

                    tusu.commit();
                    res.json({
                        mensaje: "successfully",
                        detmensaje: "Registro almacenado satisfactoriamente",
                        body: {
                            user,
                            per
                        }
                    });
                })
            });
        });

    } catch (error) {
        tper.rollback();
        tusu.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });

    }
})

routes.put('/put/:idpersona/:idusuario', verificaToken, validateCreate, async (req, res) => {
    const tusu = await database.transaction();
    const tper = await database.transaction();
    let validacionPassword = false;
    await usuariomodel.findByPk(req.params.idusuario).then((user) => {
        console.log(user.password)
        console.log(md5(req.body.usuario.password))
        if (user.password !== md5(req.body.usuario.password)) {
            //Logica para verificar que la contrasena coincida
            res.json({
                mensaje: "error",
                detmensaje: "Verifique la contraseña actual de la cuenta"
            });
            return;
        } else {
            validacionPassword = true;
        }
    });

    if (!validacionPassword) return;

    if (req.body.usuario.newpassword !== '' && req.body.usuario.newpassword !== null) {
        req.body.usuario.password = md5(req.body.usuario.newpassword);
    } else {
        req.body.usuario.password = md5(req.body.usuario.password);
    }

    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (errorAuth, authData) => {

            if (errorAuth) {
                //Logica para los que si tienen token
                if (!validateNivel({ authData: authData })) {
                    res.json({
                        mensaje: "error",
                        detmensaje: "Error de autenticacion"
                    });
                    return;
                };
            }

            const per = await persona.update(req.body.persona, { where: { idpersona: req.params.idpersona } }, { transaction: tper }).then(() => {
                tper.commit();
            });
            const user = await usuariomodel.update(req.body.usuario, { where: { idusuario: req.params.idusuario } }, { transaction: tusu }).then((user) => {
                tusu.commit();
            });

            res.json({
                mensaje: "successfully",
                detmensaje: "Registro almacenado satisfactoriamente",
                body: {
                    user,
                    per
                }
            });
        });

    } catch (error) {
        tper.rollback();
        tusu.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: "Error en el servidor, verifique los campos cargados, de lo contrario contacte con el administrador"
        });

    }
})

routes.delete('/del/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        await usuariomodel.destroy({ where: { idusuario: req.params.idusuario }, transaction: t }).then((usuarios) => {
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
                        body: usuarios
                    });
                }
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


module.exports = routes;