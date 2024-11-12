const Ad = require('../models/Ad');
const { Op } = require('sequelize');

const getAdsCountCheck = async (adID) => {
  try {

    // Calculate total tasks, including hidden tasks (if needed)
    const totalAds = await Ad.count({
      where: {
        ProjectID: adID,
      }
    });

    const adsCount = {
     totalAds,
    };

    return adsCount;
  } catch (err) {
    console.error('Error in getJobPositionCheck:', err); // Log the error for debugging
    return err;
  }
};

module.exports = getAdsCountCheck;
