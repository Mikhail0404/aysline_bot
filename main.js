require("dotenv").config();
//twitch
const tmi = require("tmi.js");
const fs = require("fs");
//
const io = require("socket.io-client");
const socket = io.connect(
  "wss://socket.donationalerts.ru:443",
  { transports: ["websocket"] },
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  }
);

var options = {
  options: {
    debug: true,
  },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: "", //имя бота
    password: "", //токен бота
  },
  channels: [""], //каналы которые парсит бот
};

let client = null;
options.identity.username = process.env.username;
options.identity.password = process.env.tokenBot;
options.channels[0] = process.env.channels;

socket.emit("add-user", {
  token: process.env.tokenDonate, //donation alerts токен
  type: "minor",
});

client = new tmi.client(options);
client.connect();
console.log("Connected to Twitch succefully end");

//donation alerts
//Connect
socket.on("connect", function (data) {
  console.log("Connected to Donation Alerts");
});
//Error
socket.on("connect_error", (err) => {
  console.error(`Donation Alerts Connection Error! ${err.message}`);
  process.exit(0);
});
//Disconnect
socket.on("disconnect", () => {
  console.log("Donation Alerts Disconnected!");
  process.exit(0);
});

socket.on("donation", function (msg) {
  donate = JSON.parse(msg);
  // console.log(donate);
  if (client) {
    client.action(
      options.channels[0],
      (donate.username ? donate.username : "Анон") +
        " - " +
        "[" +
        donate.amount +
        (donate.currency === "RUB" ? "" : " " + donate.currency) +
        "]" +
        (donate.message ? " - " + donate.message : " *молча*")
    );
  }
});
