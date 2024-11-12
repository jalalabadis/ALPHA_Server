const admin = require('firebase-admin');
const serviceAccount = require('../feed-14f2b-firebase-adminsdk-o7jsd-4e8407375b.json');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'feed-14f2b.appspot.com' // Replace with your Firebase project ID
});

const bucket = admin.storage().bucket();

const firebaseUpload = async(filePath) => {
  if (!filePath) {
    throw new Error('No file path provided.');
  }

  const imageBuffer = fs.readFileSync(filePath);

  const fileName = `images/${Date.now()}.jpg`; // Generate a unique file name
  const file = bucket.file(fileName);

  await file.save(imageBuffer, {
    metadata: { contentType: 'image/jpeg' },
    public: true, // Optional: Make the file publicly accessible
  });

  const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  return fileUrl;
};

module.exports = firebaseUpload;
