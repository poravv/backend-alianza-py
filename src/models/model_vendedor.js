const{DataTypes}=require("sequelize")
const database=require("../database")

const vendedor = database.define("vendedor",{
    idvendedor:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,},
    fb:{type:DataTypes.STRING, allowNull:false},
    inst:{type:DataTypes.STRING,allowNull:false},
    idusuario:{type:DataTypes.INTEGER,allowNull:false},
    telefono:{type:DataTypes.STRING,allowNull:false},
},{
    tableName:"vendedor",
    timestamps:false,
})


module.exports=vendedor
