const{DataTypes}=require("sequelize")
const database=require("../database")

const destacados = database.define("destacados",{
    
    iddestacados:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    idpropiedad:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:"destacados",
    timestamps:false,
})

module.exports=destacados
