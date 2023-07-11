const{DataTypes}=require("sequelize")
const database=require("../database")

const tipo_propiedad = database.define("Tipo_propiedad",{
    
    idtipo_propiedad:{
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
    tableName:"tipo_propiedad",
    timestamps:false,
})

module.exports=tipo_propiedad
