
export const levels = [
    { name: "Novice", hours: 0 },
    { name: "Beginner", hours: 10 },
    { name: "Apprentice", hours: 40 },
    { name: "Adept", hours: 100 },
    { name: "Expert", hours: 250 },
    { name: "Veteran", hours: 500 },
    { name: "Master", hours: 1000 },
    { name: "Grandmaster", hours: 2500 },
    { name: "Legend", hours: 5000 },
    { name: "Mythic", hours: 7500 },
    { name: "Mastery", hours: 10000 },
];

export const calculateLevelInfo = (totalHours: number) => {
  if (totalHours >= 10000) {
    return {
      level: "Mastery",
      progress: 100,
      hoursForNext: 0,
      currentLevelHours: 10000,
      nextLevelHours: 10000,
    };
  }

  const currentLevelIndex = levels.findIndex(l => totalHours < l.hours) - 1;
  const currentLevel = levels[currentLevelIndex] || levels[0];
  const nextLevel = levels[currentLevelIndex + 1];

  const hoursInLevel = nextLevel.hours - currentLevel.hours;
  const hoursCompletedInLevel = totalHours - currentLevel.hours;
  const progress = (hoursCompletedInLevel / hoursInLevel) * 100;
  
  return {
    level: currentLevel.name,
    progress: Math.max(0, Math.min(100, progress)),
    hoursForNext: nextLevel.hours - totalHours,
    currentLevelHours: totalHours,
    nextLevelHours: nextLevel.hours,
  };
};
