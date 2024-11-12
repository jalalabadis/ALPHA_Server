const getUserLevel=(userXP) =>{
const baseXP = 100;
const growthFactor = 1.5;

let level = 0;
    let currentXP = baseXP;

    while (userXP >= currentXP) {
        userXP -= currentXP;
        level++;
        currentXP = baseXP * Math.pow(growthFactor, level - 1);
    }

    let nextLevelXP = currentXP; // পরবর্তী লেভেলের জন্য প্রয়োজনীয় XP

    return {
        level: level,
        nextLevelXP: nextLevelXP.toFixed()
    };
}

  module.exports = getUserLevel