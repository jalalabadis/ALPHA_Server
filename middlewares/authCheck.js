const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authCheck = async (req, res, next)=>{
    try{
    const decoted = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const {userID} = decoted;
    const user = await User.findOne({ where: { id: userID }});
    if (user) {
      //console.log(user)
        req.userData = user;
      } else {
        req.userData = null; 
      }
    next();
    }
    catch{
    next()
    }
};

module.exports = authCheck;