exports.checkAndAssignBadges = (user, habit) => {
  const newBadges = [];
if (habit.currentStreak >= 3 && !user.badges.includes("Starter")) {
    newBadges.push("Starter");
  }

  if (habit.currentStreak === 7 && !user.badges.includes("Consistency King")) {
    newBadges.push("Consistency King");
  }

  if (user.xp >= 50 && !user.badges.includes("Beginner")) {
    newBadges.push("Beginner");
  }

  if (user.xp >= 100 && !user.badges.includes("Pro")) {
    newBadges.push("Pro");
  }

  return newBadges;
};