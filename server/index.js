import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { writeFile } from "fs";
// import { fileURLToPath } from "node:url";
// import { dirname, join } from "node:path";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hello");
});

io.on("connection", (socket) => {
  console.log(`a user connected :`, socket.id);
  socket.broadcast.emit("mew mew nigga!");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  //   socket.on("message", (msg) => {
  //     console.log("from client: ", msg);

  //     // socket.broadcast.emit("hi");
  //     io.emit("chat message", msg);
  //   });

  socket.on("message", (msg) => {
    console.log("from client: ", msg);
    io.emit("message", msg);

    //io.emit("hello", "world");

    //socket.broadcast.emit("hello", "mew mew nigga!");
  });
  // this will emit the event to all connected sockets

  socket.on("upload", (file, callback) => {
    debugger;
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    writeFile("/tmp/upload", file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });
});

server.listen(3000, () => console.log("server running on port 3000"));
