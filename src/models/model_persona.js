const{DataTypes}=require("sequelize")
const database = require('../database.js')
const barrio=require("./model_barrio")


const persona = database.define("persona",{
    idpersona:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull:false
    },
    documento:{
        type:DataTypes.STRING,
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    direccion:{
        type:DataTypes.STRING,
    },
    telefono:{
        type:DataTypes.STRING,
        allowNull:false
    },
    sexo:{
        type:DataTypes.STRING,
    },
    idbarrio:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fnacimiento:{
        type:DataTypes.DATE,
    },
    photo:{
        type:DataTypes.BLOB("long")
    },
    tipo_doc:{
        type:DataTypes.STRING,
    },
    nacionalidad:{
        type:DataTypes.STRING,
    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lat:{
        type:DataTypes.STRING,
    },
    long:{
        type:DataTypes.STRING,
    },
},
{
    tableName:"Persona",
    timestamps:false
})

persona.hasOne(barrio,{
    foreignKey:"idbarrio",
    primaryKey:"idbarrio",
    sourceKey:"idbarrio",
});

module.exports=persona

