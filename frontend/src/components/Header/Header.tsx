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
import { HiMenu, HiX } from "react-icons/hi";
import Loader from "../Loader/Loader";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [seeprofileDiv, setSeeProfileDiv] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const userdetails = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/user/getuserdetails`,
          { withCredentials: true }
        );
        if (userdetails.data.success) {
          setUser(userdetails.data.user);
        } else {
          navigate("/login");
        }
        setMessage({
          ...message,
          Message: "Login Successful",
          isGood: true,
        });
      } catch (error: any) {
        const err:any = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    if (message.Message) {
      const timeout = setTimeout(() => {
        setMessage({ ...message, Message: "" });
      }, 4000);
      return () => clearTimeout(timeout);
    }
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
      const err:any = error as AxiosError;
      const errorMessage = err.response?.data?.message || "An error occurred";
      setMessage({ ...message, Message: errorMessage, isGood: false });
    } finally {
      setLoading(false);
    }
  };

  const closeProfileMenu = () => {
    setSeeProfileDiv(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    closeMobileMenu();
    closeProfileMenu();
  };

  return (
    <>
      {loading && (
        <div className="h-16 px-4 md:px-0 flex justify-between items-center relative">
          <Loader />
        </div>
      )}

      <div className="h-16 px-4 md:px-0 flex justify-between items-center relative shadow-sm noScrollBar">
        <span className="flex justify-start md:justify-center items-center md:w-1/4">
          <p className="text-xl md:text-2xl orbitron font-black text-highlight transition-all duration-500 hover:scale-125">
            Nexora
          </p>
        </span>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-2xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        <span className="hidden md:flex w-1/2 items-center justify-around">
          <ThemeSwitcher isAuth={true} />
          <button
            onClick={() => setSeeProfileDiv(!seeprofileDiv)}
            className="h-14 w-14 rounded-full overflow-hidden border-2 border-transparent hover:border-highlight transition-all"
          >
            <img
              src={user?.profilePic}
              alt={`${user?.FirstName}'s profile pic`}
              className="h-full w-full rounded-full hover:scale-110 transition-all object-cover"
            />
          </button>
        </span>
      </div>

      {seeprofileDiv && (
        <div className="h-screen w-full absolute z-10 flex">
          <div className="flex flex-1" onClick={closeProfileMenu}></div>
          <div className="w-2/5 h-4/5 flex justify-center items-start">
            <button
              className="h-8 w-8 border-2 dark:border-white border-black rounded-full"
              onClick={closeProfileMenu}
            >
              X
            </button>
            <div className="bg-slate-200 dark:bg-slate-950 w-9/12 h-full rounded-xl py-2">
              <div className="w-full h-fit border-b border-black dark:border-slate-50 p-2 flex">
                <div className="h-16 w-16 rounded-full flex bg-red-200">
                  <img
                    src={user?.profilePic}
                    alt={`${user?.FirstName}'s profile pic`}
                    className="h-full w-full rounded-full hover:scale-110 transition-all object-cover"
                  />
                </div>
                <div className="px-4">
                  <p className="flex text-nowrap">Hello👋🏼,</p>
                  <p className="text-highlight">{user?.FirstName}</p>
                  <p className="text-nowrap">Welcome to NEXORA 🫠</p>
                  <p className="text-nowrap flex items-center text-xs">
                    <BiLogoGmail /> :- {user?.Email}
                  </p>
                </div>
              </div>

              {[
                {
                  label: "Profile",
                  icon: <FaUser />,
                  route: `/home/user/profile/${user?._id}`,
                },
                {
                  label: "My Maps",
                  icon: <RiRoadMapFill />,
                  route: `/home/user/${user?._id}/maps`,
                },
                {
                  label: "My Assets",
                  icon: <LuCassetteTape />,
                  route: `/home/user/${user?._id}/Assets`,
                },
                {
                  label: "Create Maps",
                  icon: <LuCassetteTape />,
                  route: `/home/user/createmaps`,
                },
                {
                  label: "Create Assets",
                  icon: <LuCassetteTape />,
                  route: `/home/user/createassets`,
                },
              ].map(({ label, icon, route }) => (
                <div
                  key={label}
                  className="py-2 px-4 w-full border-b border-black dark:border-slate-50"
                >
                  <button onClick={() => navigate(route)}>
                    <p className="flex justify-center items-center">
                      {icon}
                      <span className="px-2">{label}</span>
                    </p>
                  </button>
                </div>
              ))}

              <div className="py-2 px-4 w-full border-b border-black dark:border-slate-50">
                <button
                  className="flex justify-center items-center"
                  onClick={signout}
                >
                  <IoLogOut />
                  <span className="px-2">Signout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message.Message && (
        <div
          className={`w-full text-black dark:text-white transition-all ${
            message.isGood ? "bg-green-400" : "bg-red-400"
          }`}
        >
          <p className="text-center">{message.Message}</p>
        </div>
      )}
    </>
  );
}
