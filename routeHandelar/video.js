const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
const Ad = require('../models/Ad');
dotenv.config();



// Function to create video via Tavus API
async function createTavusVideo(actor) {
  const options = {
      method: 'POST',
      headers: {
          'x-api-key': process.env.TAVUS_KEY,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: actor.actorID, 
        script: actor.script,
        video_name: actor.name,
      }),
  };

 const response = await fetch('https://tavusapi.com/v2/videos', options);
  const data = await response.json(); 
  // {
  //   status: 'queued',
  //   video_id: 'aa1db19022',
  //   hosted_url: 'https://tavus.video/596683b67c',
  //   created_at: 'Mon, 21 Oct 2024 19:09:46 GMT',
  //   video_name: 'Khs ajkys'
  // }; ///
  return data;
}

// Create Video
router.post('/create', authCheck, async (req, res) => {
  try {
    if (req.userData) {
        const readyActors = req.body.readyActor;
        const adsData = await Promise.all(readyActors.map(async (actor) => {
            const tavusResponse = await createTavusVideo(actor);
              //console.log(tavusResponse);
              if(!tavusResponse){
                return res.status(5000).send("Error")
              }
            // Create ad in the database
            const ad = await Ad.create({
                userID: req.userData.id,
                ProjectID: req.body.projectID,
                Status: 'queued',
                video_id: tavusResponse.video_id,
                videoUrl: tavusResponse.hosted_url,
                thumb: 'up',
                name: req.body.adName
            });

            return ad;
        }));

        res.status(200).send(adsData); // Return created ads with video_id
    } else {
        res.status(400).json('No User');
    }
} catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
}
 
});



// Export
module.exports = router;
