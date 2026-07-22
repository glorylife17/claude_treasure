const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(path.join(__dirname, 'data.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    wins          INTEGER NOT NULL DEFAULT 0,
    ties          INTEGER NOT NULL DEFAULT 0,
    losses        INTEGER NOT NULL DEFAULT 0,
    rounds_played INTEGER NOT NULL DEFAULT 0,
    best_score    INTEGER NOT NULL DEFAULT 0,
    total_score   INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

function toStats(row) {
  if (!row) return null;
  return {
    username: row.username,
    wins: row.wins,
    ties: row.ties,
    losses: row.losses,
    roundsPlayed: row.rounds_played,
    bestScore: row.best_score,
    totalScore: row.total_score,
  };
}

function getUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function createUser(username, passwordHash) {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
    .run(username, passwordHash);
  return getUserById(lastInsertRowid);
}

function getStatsById(id) {
  return toStats(getUserById(id));
}

function applyRoundResult(userId, score) {
  const isWin = score > 0 ? 1 : 0;
  const isTie = score === 0 ? 1 : 0;
  const isLoss = score < 0 ? 1 : 0;

  db.prepare(
    `UPDATE users SET
       wins = wins + ?,
       ties = ties + ?,
       losses = losses + ?,
       rounds_played = rounds_played + 1,
       best_score = MAX(best_score, ?),
       total_score = total_score + ?
     WHERE id = ?`
  ).run(isWin, isTie, isLoss, score, score, userId);

  return getStatsById(userId);
}

module.exports = {
  db,
  getUserByUsername,
  getUserById,
  createUser,
  getStatsById,
  applyRoundResult,
};
