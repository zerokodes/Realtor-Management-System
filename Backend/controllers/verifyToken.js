const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
            if(err) res.status(403).json("Invalid Token");
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated");
    }
}

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Yon are not Authorized");
        }
    });
};

/**const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {  
       // const roles = ['Realtor','HQAdmin','BranchAdmin'];
        console.log(req.user.role)
        if(req.user.role === 'Realtor'){
            next();
        }else{
            res.status(403).json("Yon are not Authorized");
        }
    });
};**/

function verifyHQAdmin(roles){
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
           return res.status(403).json("Yon are not Authorized");
        }
        next();
    }
}

function verifyBranchAdmin(roles){
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
           return res.status(403).json("Yon are not Authorized");
        }
        next();
    }
}

module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization,
    //verifyTokenAndAdmin,
    verifyHQAdmin,
    verifyBranchAdmin,
};