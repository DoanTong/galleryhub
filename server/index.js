import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import setupSocket from "./socket.js"
import userRouter from "./routes/UserRoute.js"
import pinRouter from "./routes/PinRoute.js"
import commentRouter from "./routes/CommentRoute.js"
import boardRouter from "./routes/BoardRoute.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
})
);


app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))


app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
setupSocket(server)

// GALLERYHUB
app.listen(port, () => {
    console.log("This is Server of GalleryHub");
});

app.use("/users", userRouter)
app.use("/pins", pinRouter)
app.use("/comments", commentRouter)
app.use("/boards", boardRouter)




mongoose
    .connect(databaseURL)
    .then(() => console.log("DB Connection Successfull.")).catch(err => console.log(err.message)); 