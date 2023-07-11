const express = require('express');
const rutas = express()

const ciudad = require('./servicios/ciudad')
const usuario = require('./servicios/usuario')
const barrio = require('./servicios/barrio')
const persona = require('./servicios/persona')
const cliente = require('./servicios/cliente')
const vendedor = require('./servicios/vendedor')
const tipo_propiedad = require('./servicios/tipo_propiedad')
const documentos = require('./servicios/documentos')
const propiedad_has_fotos = require('./servicios/propiedad_has_fotos')
const propiedad_has_documentos = require('./servicios/propiedad_has_documentos')
const fotos_propiedad = require('./servicios/fotos_propiedad')
const propiedad = require('./servicios/propiedad')

rutas.use('/alianza/api/ciudad',ciudad);
rutas.use('/alianza/api/usuario',usuario);
rutas.use('/alianza/api/barrio',barrio);
rutas.use('/alianza/api/persona',persona);
rutas.use('/alianza/api/cliente',cliente);
rutas.use('/alianza/api/vendedor',vendedor);
rutas.use('/alianza/api/tipo_propiedad',tipo_propiedad);
rutas.use('/alianza/api/documentos',documentos);
rutas.use('/alianza/api/phf',propiedad_has_fotos);
rutas.use('/alianza/api/phd',propiedad_has_documentos);
rutas.use('/alianza/api/fp',fotos_propiedad);
rutas.use('/alianza/api/propiedad',propiedad);

module.exports = rutas;