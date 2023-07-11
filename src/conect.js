const database=require("./database")

const connect = async()=>{
    try{
        await database.authenticate()
        console.log("*** CONECTADO A LA BASE DE DATOS ***")
    }catch(err){
        console.log("Error: "+err)
    }
}

module.exports = {connect}