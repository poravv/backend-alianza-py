const {Sequelize}=require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect:'mysql',
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    insecureAuth: true,
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
      }
})

module.exports=sequelize
