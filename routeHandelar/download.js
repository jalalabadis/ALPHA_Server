const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const router = express.Router();

router.post('/download-zip', async (req, res) => {
  const { readyActor } = req.body;  // Assuming readyActor contains the list of actors with their video sources
  // Define the name of the zip file
  const zipFileName = `videos_${Date.now()}.zip`;
  const zipFilePath = path.join(__dirname, '../uploads', zipFileName);

  // Create a file stream for the zip file
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }  // Set the compression level (9 is highest)
  });

  // Handle errors
  output.on('close', () => {
    console.log(`ZIP file created: ${archive.pointer()} total bytes`);
    // Send the zip file to the client
    res.download(zipFilePath, (err) => {
      if (err) {
        console.error('Error while sending the zip file:', err);
        res.status(500).send('Error downloading the file.');
      }

      // Optionally: Delete the zip file after sending it to the client
      fs.unlinkSync(zipFilePath);
    });
  });

  archive.on('error', (err) => {
    throw err;
  });

  // Pipe the archive data to the output stream
  archive.pipe(output);

  // Loop through each actor and append their video to the zip file
  readyActor.forEach((actor) => {
    const videoPath = path.join(__dirname, '..', actor.video_src);  // Full path to the video file
    const videoName = path.basename(actor.video_src);  // Get the video file name
    archive.file(videoPath, { name: videoName });  // Append the file to the archive
  });

  // Finalize the archive (this will trigger the 'close' event)
  archive.finalize();
});

module.exports = router;
