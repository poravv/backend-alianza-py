
//Authorization: Bearer <token>
module.exports = (req, res, next) => {
    const bearerheader = req.headers['authorization']??null;
    if (typeof bearerheader !== 'undefined') {
        try {
            const bearertoken = bearerheader.split(" ")[1];
            req.token = bearertoken;
            next();
        } catch (error) {
            res.status(401).json({
                    mensaje: "error",
                    detmensaje:"Acceso denegado",
                    error:error
            });
        }
    } else {
            res.status(401).json({
                mensaje: "error",
                detmensaje:"Acceso denegado",
                error:error
            });
    }
}
