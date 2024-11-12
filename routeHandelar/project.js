const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const authCheck = require('../middlewares/authCheck');
const Project = require('../models/Project');
const getAdsCountCheck = require('../middlewares/getAdsCountCheck');
dotenv.config();



//////New Sheet
router.post('/add', authCheck, async (req, res)=>{
    try{
const { name, website, description, proposition, ideal, points}= req.body;
if(req.userData){
 const newProject = await Project.create({
    userID: req.userData.id,
    name, website, description, proposition, ideal, points
  });
   res.status(200).json(newProject);
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


  //////My Project
router.post('/my', authCheck, async (req, res)=>{
  try{
    if(req.userData){
  const project = await Project.findAll({ where: { userID: req.userData.id } });
  const projectWithAdsData = await Promise.all(project.map(async (item) => {
    // Call the getJobPositionCheck middleware for each job ID
    const projectAdsData = await getAdsCountCheck(item.id);

    // Spread the jobPositionData into the job object
    return {
      ...item.toJSON(),   
      ...projectAdsData
    };
  }));
    
     res.status(200).json(projectWithAdsData);
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


//////Edit Project
router.post('/edit', authCheck, async (req, res)=>{
  try{
    const {id, name, website, description, proposition, ideal, points}= req.body;
    if(req.userData){
      const projectData = await Project.findOne({ where: { id: id, userID: req.userData.id } });
      if(!projectData){
        return  res.status(500).send('Project not found');
      }
     const updateProject = await projectData.update({
        name, website, description, proposition, ideal, points
      });
       res.status(200).json(updateProject);
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




//////Delete
router.post('/delete', authCheck, async (req, res)=>{
  const {id}= req.body;
  try{
    if(req.userData){
      const projectData = await Project.findOne({ where: { id, userID: req.userData.id } });
      if(!projectData){
        return  res.status(500).send('Project not found');
      }
      await projectData.destroy();
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



  /////Singe Project
  router.post('/single', authCheck, async (req, res)=>{
    try{
      if(req.userData){
    const project = await Project.findOne({ where: { id: req.body.id } });
       res.status(200).json(project);
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







//Export
module.exports = router;