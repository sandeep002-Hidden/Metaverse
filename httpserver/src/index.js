import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import AuthRouter from "../route/auth.router.js"
import prisma from "../prisma/prisma.js";
import UserRouter from "../route/user.router.js"
import authMiddleWare from "../middlewares/authMiddleWare.js"
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

app.use("/api/v1/users/auth",AuthRouter)
app.use("/api/v1/users",authMiddleWare,UserRouter)
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
