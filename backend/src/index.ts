import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger } from "./utils/logger.js";
import { connectDB } from "./utils/db.js";
import { userRouter } from "./routes/user.routes.js";
import { envKeys } from "./utils/envKeys.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: envKeys.CLIENT_URL,
    credentials: true,
  })
);

const PORT: number = envKeys.PORT;

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
connectDB(envKeys.MONGO_URL as string)
  .then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error("Mongo db connect error: ", err);
    process.exit(1);
  });
