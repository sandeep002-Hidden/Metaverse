import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {getuserdetails,search} from"../controllers/user/user.controller.js"
import authMiddleWare from "../middlewares/authMiddleWare.js";
import find from "../controllers/user/find.js"
const router = Router();
router.route("/user/getuserdetails").get(authMiddleWare,getuserdetails)
router.route("/find").post(authMiddleWare,find)
router.route("/search/:query").get(search)
// router.route("/user/")
export default router;
