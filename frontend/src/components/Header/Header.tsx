import { useEffect, useState } from "react";
import { BiLogoGmail } from "react-icons/bi";
import axios, { AxiosError } from "axios";
import { RiRoadMapFill } from "react-icons/ri";
import { LuCassetteTape } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useUser } from "../../context/userContext/usercontext";
import ThemeSwitcher from "../Toogle/ThemeSwithcer";
import { IoLogOut } from "react-icons/io5";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [seeprofileDiv, setSeeProfileDiv] = useState(false);
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userdetails = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/getuserdetails`,
          { withCredentials: true }
        );
        console.log(userdetails.data);
        if (userdetails.data.success) {
          setUser(userdetails.data.user);
        }
        setMessage({
          ...message,
          Message: "Login Successfull",
          isGood: true,
        });
      } catch (error) {
        const err = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      }
    };
    getUserDetails();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setMessage({ ...message, Message: "" });
    }, 4000);
  }, [message]);
  const signout = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/auth/logout`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate("/");
      }
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.data?.message || "An error occurred";
      setMessage({ ...message, Message: errorMessage, isGood: false });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="h-16 flex justify-between items-center">
        <span className="w-1/4 flex justify-center items-center">
          <p
            className="text-2xl orbitron font-black text-highlight  
              transition-all duration-500  hover:scale-125"
          >
            Nexora
          </p>
        </span>
        <span className=" w-1/2 flex items-center justify-around">
          <button className="font-bold hover:scale-105 transition-all">
            Asset Store
          </button>
          <button className="font-bold hover:scale-105 transition-all">
            Customer Support
          </button>
          <ThemeSwitcher isAuth={true} />
          <button
            onClick={() => {
              setSeeProfileDiv(!seeprofileDiv);
            }}
            className="h-14 w-14 rounded-full"
          >
            <img
              src={user?.profilePic}
              alt={`${user?.FirstName}'s profile pic`}
              className=" h-full w-full rounded-full hover:scale-110 transition-all object-cover"
            />
          </button>
        </span>
      </div>
      {seeprofileDiv && (
        <>
          <div className="h-screen w-full absolute z-10 flex">
            <div
              className="flex flex-1 "
              onClick={() => {
                setSeeProfileDiv(false);
              }}
            ></div>
            <div className="w-2/5 h-4/5 flex justify-center items-start">
              <button
                className="h-8 w-8 border-2 dark:border-white border-black rounded-full"
                onClick={() => {
                  setSeeProfileDiv(false);
                }}
              >
                X
              </button>
              <div className="bg-slate-200 dark:bg-slate-950 w-9/12 h-full rounded-xl py-2">
                <div className="w-full h-fit border-b border-black dark:border-slate-50 p-2 flex">
                  <div className="h-16 w-16 rounded-full flex bg-red-200">
                    <img
                      src={user?.profilePic}
                      alt={`${user?.FirstName}'s profilepic`}
                      className=" h-full w-full rounded-full hover:scale-110 transition-all object-cover"
                    />
                  </div>
                  <div className="px-4">
                    <p className=" flex text-nowrap">Hello👋🏼,</p>
                    <p className="text-highlight"> {user?.FirstName}</p>
                    <p className="text-nowrap">Welcome to NEXORA 🫠</p>
                    <p className="text-nowrap flex items-center text-xs">
                      <BiLogoGmail />
                      :-
                      {user?.Email}
                    </p>
                  </div>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    onClick={() => {
                      navigate(`/home/user/profile/${user?._id}`);
                    }}
                  >
                    <p className="flex justify-center items-center">
                      <FaUser />
                      <p className="px-2"> Profile</p>
                    </p>
                  </button>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    onClick={() => {
                      navigate(`/home/user/${user?._id}/maps`);
                    }}
                  >
                    <p className="flex justify-center items-center">
                      <RiRoadMapFill />
                      <p className="px-2"> My Maps</p>
                    </p>
                  </button>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    onClick={() => {
                      navigate(`/home/user/${user?._id}/Assets`);
                    }}
                  >
                    <p className="flex justify-center items-center">
                      <LuCassetteTape />
                      <p className="px-2"> My Assets</p>
                    </p>{" "}
                  </button>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    onClick={() => {
                      navigate(`/home/user/createmaps`);
                    }}
                  >
                    <p className="flex justify-center items-center">
                      <LuCassetteTape />
                      <p className="px-2"> Create Maps</p>
                    </p>{" "}
                  </button>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    onClick={() => {
                      navigate(`/home/user/createassets`);
                    }}
                  >
                    <p className="flex justify-center items-center">
                      <LuCassetteTape />
                      <p className="px-2"> Create Assets</p>
                    </p>{" "}
                  </button>
                </div>
                <div className="py-2 px-4 w-ful border-b border-black dark:border-slate-50">
                  <button
                    className="flex justify-center items-center"
                    onClick={signout}
                  >
                    <IoLogOut />
                    <p className="px-2">Signout</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className={`w-full text-black dark:text-white transition-all ${
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
