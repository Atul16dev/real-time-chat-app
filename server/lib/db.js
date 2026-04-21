import mongoose from "mongoose";
import dns from "dns";

// Use Google DNS + IPv4 first to fix Windows SRV lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder("ipv4first");

const connectDB = async (retries = 5, delay = 3000) => {
    for (let i = 1; i <= retries; i++) {
        try {
            mongoose.connection.on('connected', () => console.log('Database Connected'));
            const conn = await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.log(`MongoDB connection attempt ${i} failed: ${error.message}`);
            if (i === retries) {
                console.error("All connection attempts failed. Exiting.");
                process.exit(1);
            }
            console.log(`Retrying in ${delay / 1000}s...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

export default connectDB;