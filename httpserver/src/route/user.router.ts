import { Router } from "express";
import { upload } from "../middlewares/multer";
import {getuserdetails,search} from"../controllers/user/user.controller"
import authMiddleWare from "../middlewares/authMiddleWare";
import find from "../controllers/user/find"
const router = Router();
router.route("/user/getuserdetails").get(authMiddleWare,getuserdetails)
router.route("/find").post(authMiddleWare,find)
router.route("/search/:query").get(search)
// router.route("/user/")
export default router;
