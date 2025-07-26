import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import AuthRouter from "../route/auth.router"
import prisma from "../prisma/prisma";
import UserRouter from "../route/user.router"
import authMiddleWare from "../middlewares/authMiddleWare"
import AssetRouter from "../route/asset.router"
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
dotenv.config({
  path:"./env"
})
app.use(express.json());
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/v1/users/auth",AuthRouter)
app.use("/api/v1/users",UserRouter)
app.use("/api/v1/users/assets",AssetRouter)
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
