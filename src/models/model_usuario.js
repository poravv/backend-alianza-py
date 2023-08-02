const {DataTypes} = require('sequelize')
const database = require('../database')
const persona= require('./model_persona')
const vendedor = require('./model_vendedor')

const usuario= database.define("usuario",{
    idusuario:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    usuario:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nivel:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    idpersona:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false
    },
},
{
    tableName:"Usuario",
    timestamps:false
})

usuario.hasOne(persona,{
    foreignKey:"idpersona",
    primaryKey:"idpersona",
    sourceKey:"idpersona"
})

usuario.hasOne(vendedor,{
    foreignKey:"idusuario",
    primaryKey:"idusuario",
    sourceKey:"idusuario"
})

module.exports=usuario