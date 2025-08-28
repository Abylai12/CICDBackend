import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/connect-db";
import AuthRoute from "./routes/auth-route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow requests only from your frontend
  credentials: true, // Allow credentials (cookies or authorization tokens)
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Hello from Express! backend");
});

connectDB();

app.use("/api/v1/auth", AuthRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
