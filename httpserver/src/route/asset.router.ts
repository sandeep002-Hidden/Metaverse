import {Router} from "express"
import createAsset from "../controllers/asset/createAssets"
import getUserAssets from "../controllers/asset/getUserAssets"
import getAssetById from "../controllers/asset/getAssetById"
import updateAsset from "../controllers/asset/updateAsset"
import deleteAsset from "../controllers/asset/deleteAsset"
import getAssetByCategory from "../controllers/asset/getAssetByCategory"
import getAllAssets from "../controllers/asset/getAllAssets"
import authMiddleWare from "../middlewares/authMiddleWare"
const router = Router();

router.route("/createAssets").post(authMiddleWare,createAsset)
router.route("/getUserAssets/:userId").get(authMiddleWare,getUserAssets)
router.route("/getAssetById/:assetId").get(authMiddleWare,getAssetById)
router.route("/updateAsset/:assetId").put(authMiddleWare,updateAsset)
router.route("/deleteAsset/:assetId").delete(authMiddleWare,deleteAsset)
router.route("/getAssetByCategory/:category").get(getAssetByCategory)
router.route("/getAllAssets").get(getAllAssets)

export default router;
