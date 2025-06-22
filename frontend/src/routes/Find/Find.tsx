import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "@/components/Loader/Loader";
import axios from "axios";

function Find() {
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState({
    message: "",
    isGood: true,
  });
  const [type, setType] = useState("");
  const location = useLocation();

  useEffect(() => {
    const splitedPath = location.pathname.split("/");
    console.log(splitedPath)
    const typeFromPath = splitedPath[2];
    setType(typeFromPath);
    const id = splitedPath[4];
    
    if (typeFromPath && id) {
      fetchById(typeFromPath, id);
    }
  }, [location]);

  const fetchById = async (type: string, id: string) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/find`,
        { type, id },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setApiResponse({
          message: response.data.message,
          isGood: response.data.success,
        });
      }
    } catch (error: any) {
      setApiResponse({
        message: error.message,
        isGood: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <div
            className={`${
              apiResponse.isGood
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } w-full`}
          >
            {apiResponse.message}
          </div>
          {type === "user" && (
            <>
              <h1>User</h1>
            </>
          )}
          {type === "map" && (
            <>
              <h1>Map</h1>
            </>
          )}
          {type === "asset" && (
            <>
              <h1>Asset</h1>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Find;