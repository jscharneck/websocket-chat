import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { writeFile } from "fs";
// import { fileURLToPath } from "node:url";
// import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 4294967296, //1GB
}); // add cors

app.use(express.static("public"));

app.get("/ip", (req, res) => {
  console.log(req.socket.remoteAddress);
  res.send("hello");
});

io.on("connection", (socket) => {
  console.log(`a user connected :`, socket.id);
  socket.broadcast.emit("mew mew nigga!");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("from client: ", msg);
    io.emit("message", msg);
  });
  // this will emit the event to all connected sockets

  socket.on("upload", (file, callback, item) => {
    console.log("file: ", file[0]); // <Buffer 25 50 44 ...>

    writeFile(
      "./uploads/file_" + Math.random() * 99000 + ".mp4",
      file[0],
      (err) => {
        callback({ message: err ? `failure ${err}` : "success" });
        io.emit("message", "file upload success");
      }
    );
  });
});

server.listen(3000, () => console.log("server running on port 3000"));
