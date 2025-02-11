const userModel=require('../models/user.models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const blackListTokenModel = require('../models/blackListToken.model');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


// module.exports.authUser = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }
//       req.user = user;
//       next();
//     });
//   };
// module.exports.authUser=async(req,res,next)=>{
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
//     if(!token){
//         return res.status(401).json({message:"unauthorized"});
//     }

//     const isBlackListed=await userModel.findOne({token:token});

//     if(isBlackListed){
//         return res.status(401).json({message:"unauthorized"})
//     }

//     try {
//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded._id);

//         req.user=user;
//         return next();

//     } catch (err) {
//         return req.status(401).json({message:"unauthorized"})
//     }
// }

