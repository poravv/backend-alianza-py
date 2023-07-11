
const validateNivel = ({authData}) => {
    console.log(authData);
    const { nivel } = authData.usuario;
    if(nivel===1||nivel===2){
        return true;
    }else{
        return false;
    }
};

module.exports ={ validateNivel }