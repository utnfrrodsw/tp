const { jsonResponse } = require("../lib/jsonResponse");
const { verifyAccessToken } = require("./verifyTokens");
const getTokenFromHeader = require("./getTokenFromHeader");

function authenticate(req, res, next){
    const token = getTokenFromHeader(req.headers);

    console.log("authenticate");

    if(token){ // si hay token
        const decoded = verifyAccessToken(token);
        if(decoded){
            req.user = {... decoded.user};
            next();
        }else{
            res.status(401).json(jsonResponse(401,{
                message: 'No token provided'
            }));
        }
        
    }else{ // si no hay token
        res.status(401).json(jsonResponse(401,{
            message: 'No token provided'
        }));
    }
}

module.exports = { authenticate };