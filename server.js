const app = require("express")();
const http = require("http").Server(app);

const PORT = process.env.PORT || 5000;

const options = {
  cors: true,
};

const io = require("socket.io")(http, options);

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("NEW socket >> " + socket.id);

  socket.on("join-chat-room", (data) => {
    socket.join(data.room);
    // console.log(`${data.name}:<${socket.id}> has join room ${data.room} `);
    const found = chatHistory.find((his) => his.room == data.room);
    if (found) {
      socket.emit("get-history", found.msgs);
    }
  });

  socket.on("send-message", (data) => {
    const found = chatHistory.find((his) => his.room == data.room);
    if (found) found.msgs.push(data);
    else chatHistory.push({ room: data.room, msgs: [data] });
    socket.to(data.room).emit("recieve-message", data);
  });

  socket.on("disconnect", () => {
    console.log("DEAD socket >> " + socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`listening on post ${PORT}...`);
});
