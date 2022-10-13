import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
});

/*
// create Websocket server on top of the http server. both server share same port(3000).
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  // socket in server.js(backend) mean connected 'browser'.
  console.log("✅ Connected to Browser");
  sockets.push(socket);
  socket["nickname"] = "Anon";
  socket.on("close", () => console.log("❌ Disconnected from the Browser"));
  socket.on("message", (data, isBinary) => {
    const dataStr = isBinary ? data : data.toString();
    const message = JSON.parse(dataStr);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
}); */

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
