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
<<<<<<< HEAD
=======
import { HiMenu, HiX } from "react-icons/hi";
import { FaStore, FaHeadset, FaMapMarkedAlt } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import Loader from "../Loader/Loader";
>>>>>>> 4d81fdd (Saving progress before branch change)

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [seeprofileDiv, setSeeProfileDiv] = useState(false);
<<<<<<< HEAD
=======
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
>>>>>>> 4d81fdd (Saving progress before branch change)
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });
<<<<<<< HEAD
  useEffect(() => {
    const getUserDetails = async () => {
      try {
=======

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
>>>>>>> 4d81fdd (Saving progress before branch change)
        const userdetails = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/getuserdetails`,
          { withCredentials: true }
        );
<<<<<<< HEAD
        console.log(userdetails.data);
        if (userdetails.data.success) {
          setUser(userdetails.data.user);
=======
        if (userdetails.data.success) {
          setUser(userdetails.data.user);
        }else{
          navigate("/login")
>>>>>>> 4d81fdd (Saving progress before branch change)
        }
        setMessage({
          ...message,
          Message: "Login Successfull",
          isGood: true,
        });
<<<<<<< HEAD
      } catch (error) {
        const err = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
=======
      } catch (error:any) {
        const err:any = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      } finally {
        setLoading(false);
>>>>>>> 4d81fdd (Saving progress before branch change)
      }
    };
    getUserDetails();
  }, []);
<<<<<<< HEAD
=======

>>>>>>> 4d81fdd (Saving progress before branch change)
  useEffect(() => {
    setTimeout(() => {
      setMessage({ ...message, Message: "" });
    }, 4000);
  }, [message]);
<<<<<<< HEAD
=======

>>>>>>> 4d81fdd (Saving progress before branch change)
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
<<<<<<< HEAD
      const err = error as AxiosError;
=======
      const err:any = error as AxiosError;
>>>>>>> 4d81fdd (Saving progress before branch change)
      const errorMessage = err.response?.data?.message || "An error occurred";
      setMessage({ ...message, Message: errorMessage, isGood: false });
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
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
=======

  const closeProfileMenu = () => {
    setSeeProfileDiv(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (route:any) => {
    navigate(route);
    closeMobileMenu();
    closeProfileMenu();
  };

  return (
    <>
      {loading && (
        <div className="h-16 px-4 md:px-0 flex justify-between items-center relative"><Loader/></div>
      )}
      <div className="h-16 px-4 md:px-0 flex justify-between items-center relative shadow-sm noScrollBar ">
        {/* Logo */}
        <span className="flex justify-start md:justify-center items-center md:w-1/4">
          <p className="text-xl md:text-2xl orbitron font-black text-highlight transition-all duration-500 hover:scale-125">
            Nexora
          </p>
        </span>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-2xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <span className="hidden md:flex w-1/2 items-center justify-around">
          
>>>>>>> 4d81fdd (Saving progress before branch change)
          <ThemeSwitcher isAuth={true} />
          <button
            onClick={() => {
              setSeeProfileDiv(!seeprofileDiv);
            }}
<<<<<<< HEAD
            className="h-14 w-14 rounded-full"
=======
            className="h-14 w-14 rounded-full overflow-hidden border-2 border-transparent hover:border-highlight transition-all"
>>>>>>> 4d81fdd (Saving progress before branch change)
          >
            <img
              src={user?.profilePic}
              alt={`${user?.FirstName}'s profile pic`}
<<<<<<< HEAD
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
=======
              className="h-full w-full rounded-full hover:scale-110 transition-all object-cover"
            />
          </button>
        </span>

        {/* Mobile Navigation Menu with Integrated Profile Options */}
        {mobileMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white dark:bg-slate-800 shadow-lg z-20 md:hidden rounded-b-lg overflow-hidden">
            <div className="flex flex-col py-2">
              {/* User info in mobile menu */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={user?.profilePic}
                    alt={`${user?.FirstName}'s profile pic`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Hello, {user?.FirstName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.Email}
                  </p>
                </div>
              </div>
              
              {/* Main navigation options */}
              <div className="px-2 pt-2 pb-1">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Main
                </p>
              </div>
              
              <button className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3">
                <FaStore className="text-lg text-highlight" />
                <span>Asset Store</span>
              </button>
              <button className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3">
                <FaHeadset className="text-lg text-highlight" />
                <span>Customer Support</span>
              </button>
              
              {/* User Options */}
              <div className="px-2 pt-3 pb-1">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Your Account
                </p>
              </div>
              
              <button
                onClick={() => handleNavigation(`/home/user/profile/${user?.id}`)}
                className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3"
              >
                <FaUser className="text-lg text-highlight" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => handleNavigation(`/home/user/${user?.id}/maps`)}
                className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3"
              >
                <RiRoadMapFill className="text-lg text-highlight" />
                <span>My Maps</span>
              </button>
              
              <button
                onClick={() => handleNavigation(`/home/user/${user?.id}/Assets`)}
                className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3"
              >
                <LuCassetteTape className="text-lg text-highlight" />
                <span>My Assets</span>
              </button>
              
              {/* Create Options */}
              <div className="px-2 pt-3 pb-1">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Create
                </p>
              </div>
              
              <button
                onClick={() => handleNavigation(`/home/user/createmaps`)}
                className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3"
              >
                <FaMapMarkedAlt className="text-lg text-highlight" />
                <span>Create Maps</span>
              </button>
              
              <button
                onClick={() => handleNavigation(`/home/user/createassets`)}
                className="py-2 px-4 text-left font-bold hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3"
              >
                <MdCreate className="text-lg text-highlight" />
                <span>Create Assets</span>
              </button>
              
              {/* Settings & Theme */}
              <div className="px-2 pt-3 pb-1">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Settings
                </p>
              </div>
              
              <div className="py-2 px-4 flex items-center justify-between">
                <span className="font-bold">Theme</span>
                <ThemeSwitcher isAuth={true} />
              </div>
              
              <button
                onClick={signout}
                className="py-2 px-4 text-left font-bold text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-3 border-t border-gray-200 dark:border-gray-700 mt-2"
              >
                <IoLogOut className="text-lg" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Profile Dropdown */}
      {seeprofileDiv && !mobileMenuOpen && (
        <div className="hidden md:flex h-screen w-full absolute z-30 noScrollBar">
          <div
            className="flex flex-1"
            onClick={closeProfileMenu}
          ></div>
          <div className="w-2/5 h-4/5 flex flex-col items-end">
            <button
              className="h-8 w-8 border-2 dark:border-white border-black rounded-full mb-2 flex items-center justify-center"
              onClick={closeProfileMenu}
              aria-label="Close profile menu"
            >
              <HiX />
            </button>
            <div className="bg-slate-200 dark:bg-slate-950 w-9/12 h-full rounded-xl py-2 overflow-y-auto shadow-lg noScrollBar">
              <div className="w-full h-fit border-b border-black dark:border-slate-50 p-4 flex items-center space-x-4 noScrollBar">
                <div className="h-16 w-16 rounded-full flex bg-red-200">
                  <img
                    src={user?.profilePic}
                    alt={`${user?.FirstName}'s profilepic`}
                    className="h-full w-full rounded-full hover:scale-110 transition-all object-cover"
                  />
                </div>
                <div>
                  <p>Hello👋🏼,</p>
                  <p className="text-highlight text-lg font-bold">{user?.FirstName}</p>
                  <p>Welcome to NEXORA 🫠</p>
                  <p className="flex items-center text-xs mt-1">
                    <BiLogoGmail className="mr-1" />
                    <span className="truncate max-w-xs">{user?.Email}</span>
                  </p>
                </div>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/profile/${user?.id}`)}
                >
                  <p className="flex items-center">
                    <FaUser className="mr-3 text-highlight" />
                    <span>Profile</span>
                  </p>
                </button>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/${user?.id}/maps`)}
                >
                  <p className="flex items-center">
                    <RiRoadMapFill className="mr-3 text-highlight" />
                    <span>My Maps</span>
                  </p>
                </button>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/${user?.id}/Assets`)}
                >
                  <p className="flex items-center">
                    <LuCassetteTape className="mr-3 text-highlight" />
                    <span>My Assets</span>
                  </p>
                </button>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/createmaps`)}
                >
                  <p className="flex items-center">
                    <FaMapMarkedAlt className="mr-3 text-highlight" />
                    <span>Create Maps</span>
                  </p>
                </button>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/createassets`)}
                >
                  <p className="flex items-center">
                    <MdCreate className="mr-3 text-highlight" />
                    <span>Create Assets</span>
                  </p>
                </button>
              </div>
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left hover:text-highlight transition-colors"
                  onClick={() => handleNavigation(`/home/user/createassets`)}
                >
                  <p className="flex items-center">
                    <MdCreate className="mr-3 text-highlight" />
                    <span>Create Assets</span>
                  </p>
                </button>
              </div>
              
              <div className="py-3 px-4 border-b border-black dark:border-slate-50">
                <button
                  className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  onClick={signout}
                >
                  <p className="flex items-center">
                    <IoLogOut className="mr-3" />
                    <span>Sign Out</span>
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Toast */}
      <div
        className={`w-full text-black dark:text-white transition-all ${
          message.isGood ? "bg-green-400" : "bg-red-400"
>>>>>>> 4d81fdd (Saving progress before branch change)
        } ${
          message.Message ? "h-12" : "hidden"
        } flex justify-between items-center`}
      >
<<<<<<< HEAD
        <span className={`w-fit px-12`}>{message.Message}</span>
        <span className={`w-1/6 flex justify-center items-center text-xl`}>
=======
        <span className="w-fit px-4 md:px-12 truncate">{message.Message}</span>
        <span className="min-w-max flex justify-center items-center text-xl px-2">
>>>>>>> 4d81fdd (Saving progress before branch change)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 4d81fdd (Saving progress before branch change)
