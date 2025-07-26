import {Router} from "express"
import createAsset from "../controllers/asset/createAssets.js"
import getUserAssets from "../controllers/asset/getUserAssets.js"
import getAssetById from "../controllers/asset/getAssetById.js"
import updateAsset from "../controllers/asset/updateAsset.js"
import deleteAsset from "../controllers/asset/deleteAsset.js"
import getAssetByCategory from "../controllers/asset/getAssetByCategory.js"
import getAllAssets from "../controllers/asset/getAllAssets.js"
import authMiddleWare from "../middlewares/authMiddleWare.js"
const router = Router();

router.route("/createAssets").post(authMiddleWare,createAsset)
router.route("/getUserAssets/:userId").get(authMiddleWare,getUserAssets)
router.route("/getAssetById/:assetId").get(authMiddleWare,getAssetById)
router.route("/updateAsset/:assetId").put(authMiddleWare,updateAsset)
router.route("/deleteAsset/:assetId").delete(authMiddleWare,deleteAsset)
router.route("/getAssetByCategory/:category").get(getAssetByCategory)
router.route("/getAllAssets").get(getAllAssets)

export default router;
