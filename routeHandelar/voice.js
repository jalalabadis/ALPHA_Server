const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authCheck = require('../middlewares/authCheck');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config();


// Create Voice
router.post('/create', authCheck, async (req, res) => {
  try {
    if (req.userData) {
      const { readyActor } = req.body;  // Extracting the actors array

      // Map through each actor to generate their voice using ElevenLabs API directly via axios
      const voicesPromises = readyActor.map(async (actor) => {
        try {
          const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${actor.voice_id}`;

          const headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVENLABS_KEY  // Replace with your API key
          };

          const data = {
            text: actor.script,
            model_id: "eleven_monolingual_v1",  // Ensure you use the correct model ID
            voice_settings: {
              stability: 0.5,  // Adjust these values as needed
              similarity_boost: 0.5
            }
          };
          // Send a POST request and handle streaming response
          const response = await axios({
            url: apiUrl,
            method: 'POST',
            responseType: 'stream',  // Stream the audio response
            headers: headers,
            data: data
          });

          // Define the file path for saving the MP3
          const fileName = `audio_${actor.id}_${Date.now()}.mp3`;
          const filePath = path.join(__dirname, '../uploads', fileName);  // Ensures correct file path

          // Create a write stream to save the file
          const writer = fs.createWriteStream(filePath);

          // Pipe the response stream directly to the file
          response.data.pipe(writer);

          // Wait for the file to be fully written
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          // Return the correct URL format for the frontend (removing the './')
          return { id: actor.id, voice_src: `/uploads/${fileName}` };

        } catch (error) {
          console.error(`Error generating voice for actor ${actor.id}:`, error.message);
          return { id: actor.id, voice_src: null };  // Return null in case of an error
        }
      });

      const voiceResults = await Promise.all(voicesPromises);  // Wait for all voice generation promises
      res.status(200).send(voiceResults);  // Send the results back to the frontend

    } else {
      res.status(400).json('No User');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// Export
module.exports = router;
