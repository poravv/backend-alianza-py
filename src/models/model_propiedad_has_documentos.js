const{DataTypes}=require("sequelize")
const database=require("../database")

const propiedad_has_fotos = database.define("Propiedad_has_fotos",{
    
    idpropiedad:{
        type:DataTypes.INTEGER,
    },
    iddocumentos:{
        type:DataTypes.INTEGER,
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:"propiedad_has_fotos",
    timestamps:false,
})

module.exports=propiedad_has_fotos
