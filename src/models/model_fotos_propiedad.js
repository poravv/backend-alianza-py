const{DataTypes}=require("sequelize")
const database=require("../database")

const fotos_propiedad = database.define("Fotos_propiedad",{
    
    idfotos:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    data:{
        type:DataTypes.BLOB("long"),
    },
    estado:{
        type:DataTypes.STRING,
    },
    name:{
        type:DataTypes.STRING,
    },
    type:{
        type:DataTypes.STRING,
    }
},{
    tableName:"fotos_propiedad",
    timestamps:false,
})

module.exports=fotos_propiedad
