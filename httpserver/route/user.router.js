import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {getuserdetails} from"../controllers/user/user.controller.js"
import authMiddleWare from "../middlewares/authMiddleWare.js";
const router = Router();
router.route("/user/getuserdetails").get(authMiddleWare,getuserdetails)
// router.route("/user/")
export default router;
