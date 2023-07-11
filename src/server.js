const express = require('express');
const app = express()
const cors = require('cors');
const configrutas =  require('./config_rutas')
const port = process.env.PORT||4002;
const { connect } = require('./conect')
const path = require('path')

/*Conexion a la base de datos*/
connect();
/*aplica permiso para todos los origenes*/
app.use(cors());

app.use(express.urlencoded({extended : false}))
app.use(express.json({limit: '50mb',extended: true, parameterLimit:500000}));
app.use(express.json())
app.use(express.static(path.join(__dirname,'../uploads')))

app.use(configrutas)

//Ruta principal
app.get('/',(req,res)=>{
    res.send('Api Alianza py')
});

//Server Running ----------------------
app.listen(port,()=>{
    console.log("server corriendo en puerto: ",port);
});
