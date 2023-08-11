const{DataTypes}=require("sequelize")
const database=require("../database")

const vw_persona_usuario = database.define("vw_persona_usuario",{
    idpersona:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true,},
    nombre:{type:DataTypes.STRING, allowNull:false},
    apellido:{type:DataTypes.STRING, allowNull:false},
    documento:{type:DataTypes.STRING, allowNull:false},
	idusuario:{type:DataTypes.STRING, allowNull:false},
    estado:{type:DataTypes.STRING, allowNull:false}
},{
    tableName:"vw_persona_usuario",
    timestamps:false,
})

module.exports=vw_persona_usuario
