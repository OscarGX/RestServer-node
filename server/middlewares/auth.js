const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.user;
        next();
    });
}

const verifyAdminRole = (req, res, next) => {
    let user = req.usuario;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            ok: false,
            err: 'El usuario no cuenta con privilegios de administrador'
        });
    }
}

module.exports = {
    verifyToken,
    verifyAdminRole
}