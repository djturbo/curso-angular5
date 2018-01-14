'use strict'
const jwt = require('jwt-simple');
const moment = require('moment');
const secret = '@djturbo';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'not Authorization header found'});
    }else{
        var token = req.headers.authorization.trim();
        try{
            var payload = jwt.decode(token, secret);
            if(payload && payload.exp <= moment().unix()){
                return res.status(401).send({message: 'El token ya ha expirado'});
            }
        }catch(ex){
            return res.status(403).send({message: 'token no válido'});
        }
        req.user = payload;
        next();
    }
}