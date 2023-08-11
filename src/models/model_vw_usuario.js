const {DataTypes} = require('sequelize')
const database = require('../database')
const persona= require('./model_persona')
const vendedor = require('./model_vendedor')

const vw_usuario= database.define("vw_usuarios",{
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
    correo:{type:DataTypes.STRING,allowNull:false},
    nombre:{type:DataTypes.STRING},
    apellido:{type:DataTypes.STRING},
    documento:{type:DataTypes.STRING},
    direccion:{type:DataTypes.STRING},
    barrio:{type:DataTypes.STRING},
    ciudad:{type:DataTypes.STRING},
    sexo :{type:DataTypes.STRING}
},
{
    tableName:"vw_usuarios",
    timestamps:false
})

vw_usuario.hasOne(persona,{
    foreignKey:"idpersona",
    primaryKey:"idpersona",
    sourceKey:"idpersona"
})

vw_usuario.hasOne(vendedor,{
    foreignKey:"idusuario",
    primaryKey:"idusuario",
    sourceKey:"idusuario"
})

module.exports=vw_usuario