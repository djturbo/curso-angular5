'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const  secret = '@djturbo';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'day').unix()
    };
    console.log('Create Token Payload: ', payload);
    return jwt.encode(payload, secret);
};