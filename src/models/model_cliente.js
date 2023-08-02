const{DataTypes}=require("sequelize")
const database=require("../database")
const persona= require('./model_persona')

const cliente = database.define("cliente",{
    
    idcliente:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    categoria:{
        type:DataTypes.STRING,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idpersona:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{
    tableName:"cliente",
    timestamps:false,
})

cliente.hasOne(persona,{
    foreignKey:"idpersona",
    primaryKey:"idpersona",
    sourceKey:"idpersona"
})

module.exports=cliente
