import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
//import { Server } from "socket.io";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

//dotenv.config();

const app = express();
const server = http.createServer(app);

/*const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
*/


app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req,res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);

// Socket connection
/*io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
*/

await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});