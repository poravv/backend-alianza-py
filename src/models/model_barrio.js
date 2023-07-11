const{DataTypes}=require("sequelize")
const database=require("../database")
const ciudad=require("./model_ciudad")

const barrio = database.define("barrio",{
    
    idbarrio:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    long:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idciudad:{
        type:DataTypes.INTEGER,
        foreignKey:true,
    },
},{
    tableName:"barrio",
    timestamps:false,
});

barrio.hasOne(ciudad,{
    foreignKey:"idciudad",
    primaryKey:"idciudad",
    sourceKey:"idciudad",
});

module.exports=barrio
