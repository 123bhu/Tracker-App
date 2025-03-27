const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = socketIo(server);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  console.log("connect");
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("something wrong in connection");
  });

server.listen(8080, () => {
  console.log(`Backend server is running http://localhost:${8080} `);
});
