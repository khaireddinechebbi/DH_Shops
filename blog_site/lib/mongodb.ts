import mongoose from "mongoose";

const connectDB = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("Already connected to database");
        return;
    }

    if (connectionState === 2) {
        console.log("Connection...")
        return;
    }

    try {
        mongoose.connect(connectDB!, {
            dbName: 'Blog_site',
            bufferCommands: true
        });
        console.log("Connected")
    } catch (error) {
        console.log("Error: ", error);
    }
};

export default connect;