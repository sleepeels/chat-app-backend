const app = require("express")();
const http = require("http").Server(app);
const { timeStamp } = require("console");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
// **************************** //
const options = {
  cors: true,
  // origins: ["http://127.0.0.1:3000"],
};
const io = require("socket.io")(http, options);
// const io = require("socket.io")(http);

// app.use(cors());

io.on("connection", (socket) => {
  console.log("NEW socket >> " + socket.id + ":" + Date.now().toLocaleString());
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
  socket.on("disconnect", function () {
    console.log("user disconnected" + socket.id);
  });
});

// **************************** //
http.listen(PORT, () => {
  console.log(`listening on post ${PORT}...`);
});
