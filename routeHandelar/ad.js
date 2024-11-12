const express = require('express');
const router = express.Router();
const { Sequelize, Op, DataTypes } = require('sequelize');
const authCheck = require('../middlewares/authCheck');
const dotenv = require('dotenv');
const Project = require('../models/Project');
const Ad = require('../models/Ad');
dotenv.config();


// All By user
router.post('/', authCheck, async (req, res) => {
  const { page = 1, limit = 100, searchByName = '', projectBy = ''} = req.body;
  const offset = (page - 1) * limit;
  try{
    if(req.userData){
  const projects = await Project.findAll({ where: { userID: req.userData.id } });
    
  if(projects){
    // Get the total count of users based on search criteria
    const whereClause = {};
    if (req.userData.id) {
      whereClause.userID = {
        [Op.like]: `%${req.userData.id}%`, // Use LIKE for case-insensitive search
      };
    }
    if (projectBy) {
      whereClause.ProjectID = {
        [Op.like]: `%${projectBy}%`, // Use LIKE for case-insensitive search
      };
    }
    if (searchByName) {
      whereClause.name = {
        [Op.like]: `%${searchByName}%`, // Use LIKE for case-insensitive search
      };
    }

    // Get total counts based on user status
    const totalCount = await Ad.count({ where: whereClause });
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);

    const ads = await Ad.findAll({
          where: whereClause,
          offset,
          limit,
        });
     res.status(200).json({projects, ads, totalPages});
  }
}
else{
  res.status(400).json('no User');
}
  }
catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error');
}
});

///Delete
router.post('/delete', authCheck, async (req, res)=>{
  const {id}= req.body;
  try{
    if(req.userData){
      const adData = await Ad.findOne({ where: { id } });
      if(!adData){
        return  res.status(500).send('Ads not found');
      }
      await adData.destroy();
      res.status(200).json({id: id});
    }
    else{
      res.status(400).json('no User');
    }
      }
    catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

});

// Export
module.exports = router;
