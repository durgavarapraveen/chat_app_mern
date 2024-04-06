const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Data = require("./Data/Data");
const connectDB = require("./Config/db");
const UserRoutes = require("./Routes/UserRoutes");
const ChatRoutes = require("./Routes/ChatRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
const corsorigin = {
  origin: "http://localhost:5173",
};
app.use(cors(corsorigin));
app.use(express.json());

app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);

// -------------Deployment----------------

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/Client/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.join(process.cwd(), "/Client/dist/index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// -----------------Deployment----------------

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection", userData._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Joined Room: " + room);
  });

  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.in(chatId).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) {
      return console.log("Chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected from socket.io");
    socket.leave(userData._id);
  });
});
