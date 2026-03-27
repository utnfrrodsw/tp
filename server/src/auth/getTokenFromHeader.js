function getTokenFromHeader(headers){
    console.log(headers + " && " + headers.authorization + " === " + headers && headers.authorization);
    if(headers && headers.authorization){
        let parted = headers.authorization.split(' ');
        
        if(parted.length === 2){
            return parted[1];
        }else{
            return null;
        }
    }else{  
        return null;
    }
}

module.exports = getTokenFromHeader;