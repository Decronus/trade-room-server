const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3000;

const SECONDS = 120;

let timer = SECONDS;
let hours = undefined;
let minutes = undefined;
let seconds = undefined;

const secondsToTime = (sec) => {
  hours = Math.floor(sec / 3600);
  minutes = Math.floor((sec - hours * 3600) / 60);
  seconds = sec - (minutes * 60 + hours * 3600);
  if (hours <= 9) {
    hours = `0${hours}`;
  }
  if (minutes <= 9) {
    minutes = `0${minutes}`;
  }
  if (seconds <= 9) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

setInterval(() => {
  if (timer === 1) {
    timer = SECONDS;
  } else {
    timer--;
  }
}, 1000);

io.on("connection", (socket) => {
  console.log("Server connected", timer);
  setInterval(() => {
    socket.emit("timer", secondsToTime(timer));
  }, 1000);
});

httpServer.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`Server is listening PORT ${PORT}`);
});
