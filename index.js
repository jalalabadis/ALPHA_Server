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
const authHandelar = require('./routeHandelar/userAuth');
const uploadHandelar = require('./routeHandelar/upload');


const sequelize = require('./database/database');

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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});






////listen server
app.listen(PORT, ()=>{
    console.log('Server run port '+PORT);
});