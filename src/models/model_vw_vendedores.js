const{DataTypes}=require("sequelize")
const database=require("../database")

const vw_vendedor = database.define("vw_vendedores",{
    idvendedor:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,},
    fb:{type:DataTypes.STRING, allowNull:false},
    inst:{type:DataTypes.STRING,allowNull:false},
    idusuario:{type:DataTypes.INTEGER,allowNull:false},
    telefono:{type:DataTypes.STRING,allowNull:false},
    idpersona:{type:DataTypes.INTEGER,allowNull:false},
    nombre:{type:DataTypes.STRING,allowNull:false},
    apellido:{type:DataTypes.STRING,allowNull:false},
    documento:{type:DataTypes.STRING,allowNull:false},
    direccion:{type:DataTypes.STRING,allowNull:false},
    barrio:{type:DataTypes.STRING,allowNull:false},
    ciudad:{type:DataTypes.STRING,allowNull:false},
    sexo:{type:DataTypes.STRING,allowNull:false},
    correo:{type:DataTypes.STRING,allowNull:false},
    estado:{type:DataTypes.STRING,allowNull:false},
},{
    tableName:"vw_vendedores",
    timestamps:false,
})

module.exports=vw_vendedor
