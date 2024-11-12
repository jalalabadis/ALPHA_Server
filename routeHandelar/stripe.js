const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const authCheck = require('../middlewares/authCheck');
const Sheed = require('../models/Project');
const Row = require('../models/Ad');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const createVideo = require('../middlewares/createVideo');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
dotenv.config();


const stripe = Stripe(process.env.STRIPE_KEY);

///////
router.post('/create-payment-intent', async (req, res)=>{
  const { amount } = req.body;
  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: 'usd',
    });

    // Wait for payment confirmation on the frontend
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }

});


router.post('/confirm-payment', authCheck, async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    if (req.userData) {
      // Find the user by their email
      const user = await User.findOne({ where: { email: req.userData.email } });
      if (!user) return res.status(404).send('User not detected. Contact Admin');

      // Retrieve the PaymentIntent to ensure it's confirmed
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Save the transaction to the database
        await Transaction.create({
          email: user.email,
          amount: paymentIntent.amount / 100, // Convert from cents to dollars
          transactionId: paymentIntent.id,
        });

        // Update the user's subscription and expiry date
        await User.update(
          {
            subscription: 'Pro',
            expire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          },
          {
            where: { email: user.email } // Specify the user to update
          }
        );

        res.status(200).send({ success: true, transactionId: paymentIntent.id });
      } else {
        res.status(400).send({ error: 'Payment not successful' });
      }
    } else {
      res.status(400).json('No User');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});





//////New Sheet
router.post('/add', authCheck, async (req, res)=>{
    try{
      if(req.userData){
    const sheed = await Sheed.create(
        { email: req.userData.email,
            row: 1,
            caption: 'Simple Text Title Caption Discount',
            downloadURL: ''
        });
      
  await Row.create({
    id: uuidv4(),
    sheedID: sheed.id,
    Status: "no render",
    Background: "default.jpeg",
    Text_1: "Welcome ",
    Text_2: "This is just an example template",
    Text_3: "Used in the quick start guide",
    Text_4: "creatomate.com/docs"
  });
   res.status(200).json(sheed.id);
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


  //////Save Sheet
router.post('/save', async (req, res)=>{
  try{
const unSaveItem =req.body.unSaveItem;
//console.log(unSaveItem)
for (const task of unSaveItem) {
  const row = await Row.findOne({ where: { id: task.id } });

  if(row){
   await row.update({
    sheedID: req.body.sheetID,
    Status: "no render",
    Background: task.Background,
    Text_1: task.Text_1,
    Text_2: task.Text_1,
    Text_3: task.Text_1,
    Text_4: task.Text_1
    })
  }
  else{
    await Row.create({
    id: task.id,
    sheedID: req.body.sheetID,
    Status: "no render",
    Background: task.Background,
    Text_1: task.Text_1,
    Text_2: task.Text_1,
    Text_3: task.Text_1,
    Text_4: task.Text_1
    });
  }
    
};

  const sheed = await Sheed.findOne({ where: { id: req.body.sheetID } });
  const row = await Row.findAll({ where: { sheedID: req.body.sheetID } });
    
     res.status(200).json({sheed, row});
  }
catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error');
}
});

//////All Sheed
router.post('/', async (req, res)=>{
  try{
  const sheed = await Sheed.findAll();
    
     res.status(200).json(sheed);
}
catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error');
}
});


//////My Sheed
router.post('/my', authCheck, async (req, res)=>{
  try{
    if(req.userData){
  const sheed = await Sheed.findAll({ where: { email: req.userData.email } });
    
     res.status(200).json(sheed);
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
 


//////Single Sheed
router.post('/single', async (req, res)=>{
  try{
  const sheed = await Sheed.findOne({ where: { id: req.body.id } });
  const row = await Row.findAll({ where: { sheedID: req.body.id } });
    
     res.status(200).json({sheed, row});
  }
catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error');
}
});


//////////////////////////////////////////////////////////////////
//////My Sheed render 
router.post('/render', authCheck, async (req, res)=>{
  try{
    const taskList =req.body.selectedTasks;

    for (const task of taskList) {
      const row = await Row.findOne({ where: { id: task, Status: "no render"} });
    
      if(row){
    const videoURL = await createVideo(row);
    await row.update({
      Status: videoURL?'render':row.Status,
      videoURL
    });
      };
        
    };
    
      const sheed = await Sheed.findOne({ where: { id: req.body.sheetID } });
      const row = await Row.findAll({ where: { sheedID: req.body.sheetID } });
        
         res.status(200).json({sheed, row});
      }
    catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
});

//////My Sheed Delete 
router.post('/delete', authCheck, async (req, res)=>{
  try{
    const taskList =req.body.selectedTasks;

    for (const task of taskList) {
      const row = await Row.findOne({ where: { id: task } });
    
      if(row){
       await row.destroy()
      }
        
    };
    
      const sheed = await Sheed.findOne({ where: { id: req.body.sheetID } });
      const row = await Row.findAll({ where: { sheedID: req.body.sheetID } });
        
         res.status(200).json({sheed, row});
      }
    catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
});

//Export
module.exports = router;