import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import AuthLayout from "./Layout/AuthLayout";
import UnAuthlayout from "./Layout/UnAuth";
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Signup from "./routes/Signup/Signup";
import ForgetPassword from "./routes/forgetPassword/ForgetPassword";
import Index from "./routes/Index/Index";
import Maps from "./routes/Maps/Maps";
import Profile from "./routes/Profile/Profile";
import CustomerSupport from "./routes/CustomerSupport/CustomerSupport";
import AssetStore from "./routes/AssetStore/AssetStore";
import MyAssets from "./routes/my/Assets/MyAssets";
import MyMaps from "./routes/my/maps/MyMaps";
import CreateAssets from "./routes/my/Assets/CreateAssets";
import AssetFabric from "./routes/my/Assets/AssetFabric";
import CreateMaps from "./routes/my/maps/CreateMaps";
import MapFabric from "./routes/my/maps/MapFabric";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<UnAuthlayout />}>
        <Route path="" element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgetpassword" element={<ForgetPassword />} />
      </Route>
      <Route path="/home" element={<AuthLayout />}>
        <Route index element={<Home />} />
        <Route path="asset" element={<AssetStore />} />//all the assets are visible
        <Route path="maps" element={<Maps />} />// all the maps are visible
        <Route path="customersupport" element={<CustomerSupport />} />
        <Route path="user">
          <Route path="profile/:id" element={<Profile />} />
          <Route path="createassets">
            <Route path="" element={<CreateAssets/>}/>
            <Route path=":assetname" element={<AssetFabric/>}/>
          </Route>
          <Route path="createmaps">
            <Route path="" element={<CreateMaps/>}/>
            <Route path=":mapname" element={<MapFabric/>}/>

          </Route>
          <Route path=":userId">
            <Route path="maps" element={<MyMaps />} />      //my maps are visible
            <Route path="assets" element={<MyAssets />} />  //my assets are visible
          </Route>

        </Route>
      </Route>
    </>
  )
);
