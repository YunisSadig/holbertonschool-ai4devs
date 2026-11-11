// Leaderboard: rank players by score, highest first.

// Intended: return a NEW array of player objects sorted by score descending,
// where scores are numbers. E.g. scores 5, 10, 1 -> 10, 5, 1.
function rankPlayers(players) {
  return players.map((p) => ({ ...p, score: String(p.score) })) // scores arrive as strings from a form
    .sort((a, b) => b.score > a.score ? 1 : -1);
}

// Intended: return the highest score as a number.
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
  console.log(rankPlayers(players).map((p) => p.name)); // intended: [ 'bob', 'ana', 'cy' ]
  console.log(topScore(players)); // intended: 10
}
