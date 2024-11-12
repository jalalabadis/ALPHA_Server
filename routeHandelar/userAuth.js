const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authCheck = require('../middlewares/authCheck');
const checkValidEmail = require('../middlewares/checkValidEmail');
const passwordhashing = require('../middlewares/passwordhashing');
const bcrypt = require('bcrypt');
const getUserLevel = require('../middlewares/getUserLevel');
const calculateUserStats = require('../middlewares/calculateUserStats');

/////Signup New User Data
router.post('/sign-up', async (req, res) => {
  try {
    const existingUserEmail = await User.findOne({ where: { email: req.body.email } });
    const emailFormat = checkValidEmail(req.body.email);
    const passwords = await passwordhashing(req.body.pass);
    const userJsonData = {
      email: req.body.email,
      password: passwords,
      type: 'player',
      status: "active",
      xp: 0,
      strength: 1,
      vitality: 1,
      luck: 5,
      silver: 0,
      gold: 0
    };

    if (existingUserEmail) {
      // Email found
      res.status(200).json({ Status: false, Message: "Email already registered" });
    } else if (req.body.pass.length < 6) {
      // Password too short
      res.status(200).json({ Status: false, Message: "Password too short" });
    } else if (!emailFormat) {
      // Invalid email format
      res.status(200).json({ Status: false, Message: "Invalid email" });
    } else {
      // Store user data in database
      const newUser = await User.create(userJsonData); // This is now properly assigned
      const token = jwt.sign({ userID: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(200).json({ Status: true, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Authorization error');
  }
});


//////Login User
router.post('/login', async (req, res) => {
  try {
    const enteredPassword = req.body.pass;
    const user = await User.findOne({ where: { email: req.body.email }});

    if (!user) {
      res.status(200).json({Status: false, Message:"Email not found"});
      return;
    }

    const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);

    if (isPasswordValid) {
      if (user.status === "active") {
        const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({Status: true, token });
      } else {
        res.status(200).json({Status: false, Message:"Your account has been blocked by admin"});
      }
    } else {
      res.status(200).json({Status: false, Message:"Incorrect password"});
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({Status: false, Message:'Internal Server Error'});
  }
});

  /////Auth check
  router.post('/check', authCheck, async (req, res)=>{
    try{
      
      if(req.userData&&req.userData?.status === "active"){
        const userData = req.userData.toJSON();
        userData.userStats = await calculateUserStats(userData);
        userData.silver = parseFloat(userData.silver);
        userData.gold = parseFloat(userData.gold);
    
        //console.log(req.userData)
        res.status(200).json(userData);
      }
      else{
        res.status(500).send('Authorization failed!');
      }
    }
    catch(err){
      console.log(err);
      res.status(500).send('Server Error');
    }
    });


      /////edit-username
  router.post('/edit-username', authCheck, async (req, res)=>{
    try{
      
      if(req.userData){
      const user = await User.findOne({ where: { id: req.userData.id }});

      await user.update({
        userName: req.body.userName
      })
       
        //console.log(req.userData)
        res.status(200).json(user);
      }
      else{
        res.status(500).send('Authorization failed!');
      }
    }
    catch{
      res.status(500).send('Server Error');
    }
    });


          /////game-win
  router.post('/game-win', authCheck, async (req, res)=>{
    try{
      
      if(req.userData){
      const user = await User.findOne({ where: { id: req.userData.id }});

     const updateUserData =  await user.update({
      xp: parseFloat(req.body.xpReword)+parseFloat(user.xp),
      silver: parseFloat(req.body.silverReword)+parseFloat(user.xp),
      gold: req.body.goldReword
      })
       
        //console.log(req.userData)
        res.status(200).json(updateUserData);
      }
      else{
        res.status(500).send('Authorization failed!');
      }
    }
    catch{
      res.status(500).send('Server Error');
    }
    });

// Export router
module.exports = router;
