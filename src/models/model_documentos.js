const{DataTypes}=require("sequelize")
const database=require("../database")

const documentos = database.define("documentos",{
    
    iddocumentos:{
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
    }
},{
    tableName:"documentos",
    timestamps:false,
})

module.exports=documentos
