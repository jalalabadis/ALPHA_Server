const calculateUserStats=(userStats)=> {
    /////XP অনুযায়ী Level
    let level = 0;
    let currentXP = 100;
    const growthFactor = 1.5;
    let userXP = userStats.xp;

    while (userXP >= currentXP) {
        userXP -= currentXP;
        level++;
        currentXP = 100 * Math.pow(growthFactor, level);
    }
    let nextLevelXP = currentXP;
    


    // Strength অনুযায়ী ড্যামেজ রেঞ্জ
    const minDamage = userStats.strength * 2 - 1;
    const maxDamage = userStats.strength * 2 + 1;

    // Vitality অনুযায়ী স্বাস্থ্য পয়েন্ট
    const baseHealth = 100;
    const healthPoints = baseHealth + (userStats.vitality * 25);

    // Luck অনুযায়ী ক্রিটিকাল চ্যান্স
    const baseCritChance = 5; // শুরুতে ৫% সম্ভাবনা
    const critChance = baseCritChance + (userStats.luck * 0.1);

    // ফলাফল প্রদান
    return {
        level: level,
        nextLevelXP: nextLevelXP.toFixed(),
        damageRange: `${minDamage}-${maxDamage}`,
        healthPoints: healthPoints,
        critChance: `${critChance.toFixed()}`
    };
}

  module.exports = calculateUserStats