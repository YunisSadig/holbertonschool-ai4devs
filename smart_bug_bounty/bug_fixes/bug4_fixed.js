// Leaderboard: rank players by score, highest first (fixed).

// Returns a NEW array of player objects sorted by numeric score, descending.
// Scores may arrive as strings from a form, so they are converted to numbers.
function rankPlayers(players) {
  return players
    .map((p) => ({ ...p, score: Number(p.score) }))
    .sort((a, b) => b.score - a.score);
}

// Returns the highest score as a number.
function topScore(players) {
  return rankPlayers(players)[0].score;
}

module.exports = { rankPlayers, topScore };

if (require.main === module) {
  const players = [
    { name: 'ana', score: 5 },
    { name: 'bob', score: 10 },
    { name: 'cy', score: 1 },
  ];
  console.log(rankPlayers(players).map((p) => p.name)); // [ 'bob', 'ana', 'cy' ]
  console.log(topScore(players)); // 10
}
