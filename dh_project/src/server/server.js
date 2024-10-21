import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import productApi from "./routes/product.route.js";
import routes from "./routes/authentication.route.js";

const app = express();
const PORT = 8080;

app.use(cors());
dotenv.config()
connectDB();

app.use('/api/products', productApi)
app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})



