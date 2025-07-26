import  { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
interface AssetDetails {
  AssetName: string;
  AssetStatus: string;
  AssetCategory: string[];
}

export default function CreateAssets() {
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });
  const [AssetDetails, setAssetDetails] = useState<AssetDetails>({
    AssetName: "",
    AssetStatus: "Public",
    AssetCategory: [],
  });
  const [currentAssetCategory, setCurrentAssetCategory] = useState("");

  const addCategory = (newItem: string) => {
    const trimmedItem = newItem.trim();
    if (
      trimmedItem.length > 0 &&
      !AssetDetails.AssetCategory.includes(trimmedItem)
    ) {
      setAssetDetails({
        ...AssetDetails,
        AssetCategory: [...AssetDetails.AssetCategory, trimmedItem],
      });
      setCurrentAssetCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setAssetDetails({
      ...AssetDetails,
      AssetCategory: AssetDetails.AssetCategory.filter(
        (category) => category !== categoryToRemove
      ),
    });
  };
  const drawShape = () => {
    if (!AssetDetails.AssetName) {
      setMessage({ ...message, Message: "Asset must have a name" });
      return;
    }
    if (currentAssetCategory) {
      addCategory(currentAssetCategory);
    }
    if (AssetDetails.AssetCategory.length == 0 && !currentAssetCategory) {
      setMessage({ ...message, Message: "must include one Category" });
      return;
    }
    localStorage.setItem("AssetDetails", JSON.stringify(AssetDetails));
    navigate(`/home/user/createassets/${AssetDetails.AssetName}`);
  };
  useEffect(() => {
    setTimeout(() => {
      setMessage({ ...message, Message: "" });
    }, 4000);
  }, [message.Message]);
  return (
    <>
      <Helmet>
        <title>Create Your Assets</title>
      </Helmet>
      <div className="max-w-2xl mx-auto p-6  shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-6">Create Asset</h1>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="assetName" className="text-sm font-medium mb-1">
              Enter Asset Name
            </label>
            <input
              type="text"
              id="assetName"
              value={AssetDetails.AssetName}
              onChange={(e) => {
                setAssetDetails({ ...AssetDetails, AssetName: e.target.value });
              }}
              className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-black"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="assetStatus"
              className="text-sm font-medium mb-1 text-black dark:text-white"
            >
              Asset Status
            </label>
            <select
              id="assetStatus"
              value={AssetDetails.AssetStatus}
              onChange={(e) => {
                setAssetDetails({
                  ...AssetDetails,
                  AssetStatus: e.target.value,
                });
              }}
              className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-black"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="assetCategory" className="text-sm font-medium mb-1">
              Enter Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="assetCategory"
                value={currentAssetCategory}
                onChange={(e) => {
                  setCurrentAssetCategory(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCategory(currentAssetCategory);
                  }
                }}
                className="border rounded-md p-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-black"
              />
              {currentAssetCategory.trim().length > 0 && (
                <button
                  onClick={() => addCategory(currentAssetCategory)}
                  className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              )}
            </div>
          </div>

          <div className=" flex flex-wrap gap-2 p-4">
            {AssetDetails.AssetCategory.map((item, index) => (
              <span
                key={index}
                className="flex items-center gap-2 p-2 rounded-md"
              >
                <span className="border-4 border-violet-500 rounded-xl p-2">
                  {item}
                </span>
                <button
                  onClick={() => removeCategory(item)}
                  className="text-red-500 hover:scale-125 border border-red-500 hover:text-red-600 transition-colors rounded-full h-4 flex justify-center items-center w-4"
                >
                  X
                </button>
              </span>
            ))}
          </div>
          <div className="">
            <button
              className="shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969] rounded-md font-light transition duration-200 ease-linear w-full"
              onClick={drawShape}
            >
              Draw Shape
            </button>
          </div>
        </div>
      </div>
      <div
        className={`w-full absolute z-10 text-black dark:text-white transition-all ${
          message.isGood ? "bg-green-400" : " bg-red-400"
        } ${
          message.Message ? "h-12" : "hidden"
        } flex justify-between items-center`}
      >
        <span className={`w-fit px-12`}>{message.Message}</span>
        <span className={`w-1/6 flex justify-center items-center text-xl`}>
          <button
            onClick={() => {
              setMessage({ ...message, Message: "" });
            }}
            className="border-cyan-200 border-2 rounded-lg px-2"
          >
            X
          </button>
        </span>
      </div>
    </>
  );
}
