import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.js";
import { connectDB } from "./utils/db.js";
import { userRouter } from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
connectDB(process.env.MONGO_URL as string)
  .then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error("Mongo db connect error: ", err);
    process.exit(1);
  });
