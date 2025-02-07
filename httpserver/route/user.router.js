import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {getuserdetails} from"../controllers/user/user.controller.js"
const router = Router();
router.route("/user/getuserdetails").get(getuserdetails)
export default router;
