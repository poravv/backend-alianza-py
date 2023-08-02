const{DataTypes}=require("sequelize")
const database=require("../database");
const propiedad_has_fotos = require("./model_propiedad_has_fotos");
const Vendedor = require("./model_vendedor");

const vw_propiedad = database.define("Vw_propiedades",{
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
    idvendedor:{type:DataTypes.INTEGER,},
    idbarrio:{type:DataTypes.INTEGER,allowNull:false},
    estado:{type:DataTypes.STRING},
    nombre:{type:DataTypes.STRING},
    apellido:{type:DataTypes.STRING},
    documento:{type:DataTypes.STRING},
    tipo_propiedad:{type:DataTypes.STRING},
    barrio:{type:DataTypes.STRING},
    idciudad:{type:DataTypes.INTEGER},
    ciudad:{type:DataTypes.STRING},
    img_vendedor:{type:DataTypes.STRING},
    nombre_vendedor:{type:DataTypes.STRING},
    doc_vendedor:{type:DataTypes.STRING},
    idusuario_vendedor:{type:DataTypes.INTEGER},
    correo_vendedor:{type:DataTypes.STRING},
    inst:{type:DataTypes.STRING},
    fb:{type:DataTypes.STRING},
    whatsapp:{type:DataTypes.STRING},
},{
    tableName:"vw_propiedades", 
    timestamps:false,
})

vw_propiedad.hasMany(propiedad_has_fotos,{
    foreignKey:"idpropiedad",
    primaryKey:"idpropiedad",
    sourceKey:"idpropiedad",
});

vw_propiedad.hasOne(Vendedor,{
    foreignKey:"idvendedor",
    primaryKey:"idvendedor",
    sourceKey:"idvendedor"
});


module.exports=vw_propiedad
