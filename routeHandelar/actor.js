const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const authCheck = require('../middlewares/authCheck');
const imageUpload = require('../middlewares/imageUpload');
const Actor = require('../models/Actor');
const Tag = require('../models/Tag');
dotenv.config();




//////Add Actor
router.post('/add',  imageUpload.single('profile'), authCheck, async (req, res)=>{
  try{
    const {name, actorID, gender, actorType, tag, videoUrl}= req.body;
    if(req.userData && name&& actorID&& gender&& actorType&& tag&&videoUrl){
    // Create the actor
     const newActor = await Actor.create({
      name,
      actorID,
      gender,
      actorType,
      videoUrl,
      profile: req.file ? req.file.path : null,
  });

  // Handle tags (if any)
  if (tag) {
      const tagArray = tag.split(','); // Assuming tags come as a comma-separated string
      const tagInstances = await Promise.all(tagArray.map(async (tagName) => {
          return await Tag.findOrCreate({ where: { tagName } });
      }));

      // Associate tags with actor
      await newActor.setTags(tagInstances.map(tag => tag[0])); // 'tags' is the alias from the association
  }

  res.json(newActor);
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



   //////All Actor
router.post('/', authCheck, async (req, res)=>{
  try{
    if(req.userData){
  const actorData = await Actor.findAll();
    
     res.status(200).json(actorData);
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
      const ActorData = await Actor.findOne({ where: { id } });
      if(!ActorData){
        return  res.status(500).send('Actor not found');
      }
      await ActorData.destroy();
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


//////Actor for Ad
   router.post('/ad', authCheck, async (req, res)=>{
    try{
      if(req.userData){
    const actorData = await Actor.findAll();
    const tagData = await Tag.findAll({limit: 8});
      
       res.status(200).json({actorData, tagData});
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