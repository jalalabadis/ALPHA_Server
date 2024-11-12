const fs = require('fs');
const axios = require('axios');

const imgbbUpload = async (filePath) => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const imageBase64 = imageBuffer.toString('base64');
    console.log(`data:image/jpeg;base64,/${imageBase64}`);

   

    return `data:image/jpeg;base64,/${imageBase64}`;
  } catch (error) {
    console.error('Error uploading to imgbb:', error);
    throw error;
  }
};

module.exports = imgbbUpload;
