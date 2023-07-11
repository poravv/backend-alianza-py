const{DataTypes}=require("sequelize")
const database=require("../database")
const persona= require('./model_persona')

const vendedor = database.define("vendedor",{
    idvendedor:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    fb:{
        type:DataTypes.STRING,
        allowNull:false
    },
    inst:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idpersona:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    telefono:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    tableName:"Vendedor",
    timestamps:false,
})

vendedor.hasOne(persona,{
    foreignKey:"idpersona",
    primaryKey:"idpersona",
    sourceKey:"idpersona"
});

module.exports=vendedor
