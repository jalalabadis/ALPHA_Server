// Middleware function to calculate XP reward
const xpRewardMiddleware =(req, res, next)=> {
    // Extracting user information from the request (e.g., from req.body or req.query)
    const { userLevel, xpPower, quest } = req.body;

    // Base XP values for different xpPower levels
    const xpBaseValues = {
        High: 20,
        Medium: 15,
        Low: 10
    };

    // Validate if xpPower is valid
    if (!xpBaseValues[xpPower]) {
        return res.status(400).json({ error: 'Invalid xpPower value. Must be High, Medium, or Low.' });
    }

    // Logic to calculate XP increment based on user level and quest count
    // Example logic: increment increases as userLevel goes up
    let xpMultiplier = 1 + (userLevel - 1) * 0.1; // 10% increment per level
    let totalXP = xpBaseValues[xpPower] * xpMultiplier * quest;

    // Adding calculated XP to the request for future processing
    req.calculatedXP = totalXP;

    console.log(`Total XP for userLevel ${userLevel}, xpPower ${xpPower}, and ${quest} quests is ${totalXP}`);
    
    // Proceed to the next middleware or route handler
    next();
}

// Export the middleware
module.exports = xpRewardMiddleware;
