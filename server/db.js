const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "./db/database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("데이터베이스 연결 오류:", err.message);
  } else {
    console.log("데이터베이스에 성공적으로 연결되었습니다.");
    db.run(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        message TEXT
      )`,
      (err) => {
        if (err) {
          console.error("messages 테이블 생성 오류:", err.message);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT UNIQUE
      )`,
      (err) => {
        if (err) {
          console.error("users 테이블 생성 오류:", err.message);
        }
      }
    );
  }
});

module.exports = db;
