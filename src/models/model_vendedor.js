const{DataTypes}=require("sequelize")
const database=require("../database")

const vendedor = database.define("vendedor",{
    idvendedor:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,},
    fb:{type:DataTypes.STRING,},
    inst:{type:DataTypes.STRING,},
    idusuario:{type:DataTypes.INTEGER,allowNull:false},
    telefono:{type:DataTypes.STRING,},
},{
    tableName:"vendedor",
    timestamps:false,
})

module.exports=vendedor
