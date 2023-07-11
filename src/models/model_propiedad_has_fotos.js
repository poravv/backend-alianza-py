const{DataTypes}=require("sequelize")
const database=require("../database")
const fotos_propiedad = require("./model_fotos_propiedad")

const propiedad_has_fotos = database.define("Propiedad_has_fotos",{
    
    idpropiedad:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    idfotos:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:"propiedad_has_fotos",
    timestamps:false,
})

propiedad_has_fotos.hasMany(fotos_propiedad,{
    foreignKey:"idfotos",
    primaryKey:"idfotos",
    sourceKey:"idfotos"
})

module.exports=propiedad_has_fotos
