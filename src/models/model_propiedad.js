const{DataTypes}=require("sequelize")
const database=require("../database")

const propiedad = database.define("Propiedad",{
    idpropiedad:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true,},
    titulo:{type:DataTypes.STRING,allowNull:false},
    descripcion:{type:DataTypes.STRING,allowNull:false},
    direccion:{type:DataTypes.STRING,allowNull:false},
    superficie_terreno:{type:DataTypes.STRING,allowNull:false},
    area_construida:{type:DataTypes.STRING,allowNull:false},
    precio:{type:DataTypes.DECIMAL,allowNull:false},
    dimencion:{type:DataTypes.STRING,allowNull:false},
    metros_c:{type:DataTypes.STRING,allowNull:false},
    lat:{type:DataTypes.STRING},
    long:{type:DataTypes.STRING},
    idtipo_propiedad:{type:DataTypes.INTEGER,allowNull:false},
    contacto_extra:{type:DataTypes.STRING},
    idcliente:{type:DataTypes.INTEGER,allowNull:false},
    dormitorio:{type:DataTypes.INTEGER},
    idusuario:{type:DataTypes.INTEGER,},
    idbarrio:{type:DataTypes.INTEGER,allowNull:false},
    estado:{type:DataTypes.STRING},
},{
    tableName:"propiedad",
    timestamps:false,
})

module.exports=propiedad
