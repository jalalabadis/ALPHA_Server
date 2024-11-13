const calculateUserStats=(userStats)=> {
    /////XP অনুযায়ী Level
    let xp = userStats.xp;
    let level = 0;
    let requiredXp = 100; // লেভেল ১ এর জন্য প্রয়োজনীয় xp
    let multiplier = 2.5; // প্রতি লেভেলের জন্য xp এর প্রয়োজনীয়তা বাড়ানোর রেশিও
    let totalXpNeeded = requiredXp; // মোট xp যা লেভেলে যেতে লাগবে

    while (xp >= requiredXp) {
        level++;
        xp -= requiredXp;
        requiredXp = Math.floor(requiredXp * multiplier);
        totalXpNeeded += requiredXp; // পরবর্তী লেভেলে যেতে প্রয়োজনীয় মোট xp যোগ করলাম
    }



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
        nextLevelXP: totalXpNeeded,
        damageRange: `${minDamage}-${maxDamage}`,
        healthPoints: healthPoints,
        critChance: `${critChance.toFixed()}`
    };
}

  module.exports = calculateUserStats