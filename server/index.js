const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("../client/dist"));

app.get("/check-nickname", (req, res) => {
  const nickname = req.query.nickname;
  if (!nickname) {
    return res.status(400).json({ available: false, error: "닉네임이 필요합니다." });
  }

  db.get("SELECT * FROM users WHERE nickname = ?", [nickname], (err, row) => {
    if (err) {
      console.error("데이터베이스 조회 오류:", err.message);
      return res.status(500).json({ available: false, error: "데이터베이스 오류" });
    }

    res.json({ available: !row });
  });
});

io.on("connection", (socket) => {
  socket.on("set nickname", (nickname) => {
    socket.username = nickname;
    io.emit("user connected", nickname);
    console.log("새로운 사용자가 연결되었습니다.", socket.username);
    db.run("INSERT INTO users (nickname) VALUES (?)", [nickname], (err, row) => {
      if (err) {
        console.error("데이터베이스 삽입 오류:", err.message);
      }
    });
  });

  socket.on("chat message", (msg) => {
    const sender = socket.username;
    io.emit("chat message", { text: msg.text, sender: sender });
    db.run("INSERT INTO messages (username, message) VALUES (?, ?)", [socket.username, msg.text], (err) => {
      if (err) {
        console.error("데이터베이스 삽입 오류:", err.message);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("사용자가 연결을 종료하였습니다.", socket.username);
    db.run("DELETE FROM users WHERE nickname = ?", [socket.username], (err) => {
      if (err) {
        console.error("데이터베이스 삭제 오류:", err.message);
      } else {
        io.emit("user disconnected", socket.username);
      }
    });
  });
});

process.on("SIGINT", () => {
  console.log("서버가 종료됩니다. 데이터베이스를 초기화합니다.");
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error("사용자 테이블 삭제 오류:", err.message);
    } else {
      console.log("사용자 테이블의 모든 데이터 삭제 완료");
    }
  });
  db.run("DELETE FROM messages", (err) => {
    if (err) {
      console.error("메시지 테이블 삭제 오류:", err.message);
    } else {
      console.log("메시지 테이블의 모든 데이터 삭제 완료");
    }
  });
});

server.listen(3000, () => {
  console.log("서버가 포트 3000에서 실행 중입니다.");
});
