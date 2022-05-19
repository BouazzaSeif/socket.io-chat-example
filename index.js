const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
var clients = [];
io.on("connection", (client) => {
  console.log("Client connected..." + client.id);
  client.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  client.on("disconnect", function () {
    console.log("Disconnect");
    io.emit("update", clients[client.id] + " has left the chat.");
    client.broadcast.emit("update", clients[client.id] + "has left the chat.");
    delete clients[client.id];
  });
  client.on("join", function (name) {
    console.log("Joined: " + name);
    clients[client.id] = name;
    client.emit("update", name + " have connected to the chat.");
    client.broadcast.emit("update", name + " has joined the server.");
  });
  client.on("typing", function (msg) {
    client.emit("update", clients[client.id] + " is typing");
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
