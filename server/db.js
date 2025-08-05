const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/crm.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      phone TEXT,
      hours TEXT,
      nextVisit TEXT,
      trialEnd TEXT,
      notes TEXT,
      advisor TEXT
    )
  `);
});

module.exports = db;