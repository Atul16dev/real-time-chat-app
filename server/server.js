import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import path from "path";

//dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

export const userSocketMap = {};

// Socket connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected " , userId);


    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    /*socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage", data);
    });
    */
    socket.on("disconnect", () => {
        console.log("User disconnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    });
});





app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cors());

app.use("/api/status", (req,res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages" , messageRouter)

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
}

await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the old process and restart.`);
        process.exit(1);
    } else {
        console.error(err);
        process.exit(1);
    }
});