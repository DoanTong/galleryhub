
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import pinRouter from "./routes/pin.route.js";
import commentRouter from "./routes/comment.route.js";
import boardRouter from "./routes/board.route.js";
import connectDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import donationRoutes from "./routes/donation.route.js";
import nftRoutes from "./routes/nft.js";
import forsaleRouter from "./routes/forsale.route.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/api/users", userRouter);
app.use("/api/pins", pinRouter);
app.use("/api/comments", commentRouter);
app.use("/api/boards", boardRouter);
app.use("/api/donations", donationRoutes);
app.use("/api/nft", nftRoutes);
app.use("/api/forsale", forsaleRouter);
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
