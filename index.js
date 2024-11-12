const express = require('express');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
var cors = require('cors');
const cron = require('node-cron');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// 
require('./models/associations');
const authHandelar = require('./routeHandelar/userAuth');
const projectHandelar = require('./routeHandelar/project');
const actorHandelar = require('./routeHandelar/actor');
const adHandelar = require('./routeHandelar/ad');
const voiceHandelar = require('./routeHandelar/voice');
const videoHandelar = require('./routeHandelar/video');
const downloadHandelar = require('./routeHandelar/download');
const uploadHandelar = require('./routeHandelar/upload');

const stripeHandelar = require('./routeHandelar/stripe');


const sequelize = require('./database/database');
const Ad = require('./models/Ad');
const User = require('./models/User');

//////////Cross
const allowedDomains = ['http://localhost:4000', 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Create a rate limit rule
const limiter = rateLimit({
  windowMs: 1000,
  max: 1,
  message: 'Too many requests from this IP, please try again after a second.',
});

//App initialization
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors('*'));
dotenv.config();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'build')));

// Set up the HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });





// Sync all models
sequelize.sync(/*{ alter: true }*/)
  .then(() => {
    console.log('Database schema updated!');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });


 

//App Routes
app.use('/auth', authHandelar);
app.use('/project', projectHandelar);
app.use('/actor', actorHandelar);
app.use('/ad', adHandelar);
app.use('/voice', limiter, voiceHandelar);
app.use('/video', limiter, videoHandelar);
app.use('/zip', downloadHandelar);
app.use('/upload', uploadHandelar);



app.use('/stripe', stripeHandelar);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});




// ===============================================
// WebSocket clients storage
const clients = new Map();

// Notify client via WebSocket
function notifyClient(userID, data) {
    const ws = clients.get(userID);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
};

// Function to check video status and update the database
async function checkVideoStatus(ad) {
    const response = await fetch(`https://tavusapi.com/v2/videos/${ad.video_id}`, {
        method: 'GET',
        headers: { 'x-api-key': process.env.TAVUS_KEY },
    });
    const data = await response.json();

    //console.log(data);

    if (data.status === 'ready') {
        // Update videoUrl and status in the database
        await Ad.update({ videoUrl: data.download_url, Status: 'completed' }, { where: { id: ad.id } });

        // Notify client via WebSocket
        notifyClient(ad.userID, { videoID: ad.id, videoUrl: data.download_url, Status: 'completed' });
    }

    return data;
}

// Periodically check video status for all ads with 'queued' status
setInterval(async () => {
    const queuedAds = await Ad.findAll({ where: { Status: 'queued' } });
    //console.log(queuedAds)
    queuedAds.forEach(ad => checkVideoStatus(ad));
}, 6000);


// WebSocket connection handler
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
      try {
          const { token } = JSON.parse(message); // Expecting token in the first message
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findOne({ where: { email: decoded.email } });
          
          if (user) {
              clients.set(user.id, ws); // Save the connection for the authenticated user
              ws.on('close', () => {
                  clients.delete(user.id); // Remove client on disconnect
              });
          } else {
              ws.close(); // Close connection if user is not found
          }
      } catch (error) {
          console.error('WebSocket error:', error);
          ws.close(); // Close the connection on error
      }
  });
});
// ==================================================


////listen server
server.listen(PORT, ()=>{
    console.log('Server run port '+PORT);
});