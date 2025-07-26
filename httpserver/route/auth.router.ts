import { Router } from "express";
import { upload } from "../middlewares/multer";
import registerUser from "../controllers/auth/registeruser.controller";
import loginUser from "../controllers/auth/login.controller";
import forgotPasswordEmail from "../controllers/auth/forgotPsaawordEmail";
import verifyOtp from "../controllers/auth/verifyOtp";
import saveNewPassword from "../controllers/auth/saveNewPassword";
import logout from "../controllers/auth/logout.Controller";
import authMiddleWare from "../middlewares/authMiddleWare"
const router = Router();

router.route("/signup").post(upload.single("ProfilePicture"), registerUser);
router.route("/login").post(loginUser);
router.route("/forgetpassword/sendemail").post(forgotPasswordEmail)
router.route("/verifyotp").post(verifyOtp)
router.route("/password/restpassword").post(saveNewPassword)
router.route("/logout").get(authMiddleWare,logout)
export default router;
