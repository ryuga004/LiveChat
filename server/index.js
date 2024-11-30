const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors(
    {
        origin: "https://live-chat-frontend-lemon.vercel.app",
        credentials: true
    }
));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.get("/", (req, res) => {
    res.json("Hello");
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);
// const io = socket(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         credentials: true,
//     },
// });
const io = socket(server, {
    cors: {
        origin: "https://live-chat-frontend-lemon.vercel.app",
        credentials: true
    }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    // socket.on("add-user", (userId) => {
    //     onlineUsers.set(userId, socket.id);
    // });

    // socket.on("send-msg", (data) => {
    //     const sendUserSocket = onlineUsers.get(data.to);
    //     if (sendUserSocket) {
    //         socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    //     }
    // });
    console.log('A user connected:', socket.id);

    socket.on("add-user", (userId) => {
        // console.log(onlineUsers);
        onlineUsers.set(userId, socket.id);

    });

    socket.on("send-msg", (data) => {
        // console.log(data);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        } else {
            console.log(`User ${data.to} is not online`);
        }
    });
});
