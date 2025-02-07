import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
interface userInfo {
  emailOrUserName: string;
  otp: Number | null;
  password: string;
  confirmPassword: string;
}
export default function ForgetPassword() {
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });
  const [isEmailVerified, setEmailIsVerified] = useState<boolean>(false);
  const [isOtpVerified, setOtpIsVerified] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [user, setUser] = useState<userInfo>({
    emailOrUserName: "",
    otp: null,
    password: "",
    confirmPassword: "",
  });
  const [hidePassword, setHidePassword] = useState({
    button: false,
    button2: true,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [loading]);
  const handleClick = async () => {
    if (loading) return;
    if (!isEmailVerified) {
      try {
        setLoading(true);
        const verifyEmail = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/auth/forgetpassword/sendemail`,
          user,
          { withCredentials: true }
        );
        if (verifyEmail.data.success) {
          setEmailIsVerified(true);
        } else {
          setMessage({
            ...message,
            Message: verifyEmail.data.message,
            isGood: false,
          });
        }
      } catch (error) {
        const err = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      } finally {
        setLoading(false);
      }
    }
    if (!isOtpVerified && user.otp) {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/auth/verifyotp`,
          user,
          { withCredentials: true }
        );
        if (res.data.success) {
          setOtpIsVerified(true);
        } else {
          setMessage({ ...message, Message: res.data.message, isGood: false });
        }
      } catch (error) {
        const err = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      } finally {
        setLoading(false);
      }
    }
    if (isOtpVerified) {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/auth/password/restpassword`,
          user,
          { withCredentials: true }
        );
        if (res.data.success) {
          setOtpIsVerified(true);
          setMessage({
            ...message,
            Message: "Password changed successfully",
            isGood: true,
          });
          navigate("/login");
        } else {
          setMessage({ ...message, Message: res.data.message, isGood: false });
        }
      } catch (error) {
        const err = error as AxiosError;
        const errorMessage = err.response?.data?.message || "An error occurred";
        setMessage({ ...message, Message: errorMessage, isGood: false });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-950 h-screen flex justify-center items-center relative z-10 top-0">
        <div
          style={{ height: "50vh" }}
          className="text-black dark:text-white rounded-lg bg-white dark:bg-black relative w-1/3 dark-login-div flex justify-around items-center "
        >
          <div className="flex flex-col h-full items-center justify-center">
            {!isOtpVerified && (
              <div className=" flex flex-col">
                <p
                  className={`text-sm  text-center ${
                    message.isGood ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {message.Message}
                </p>
                <p className="text-lg text-gray-950 font-semibold dark:text-gray-50 text-left">
                  Enter Your UserName or Email
                </p>
                <input
                  disabled={isEmailVerified}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      emailOrUserName: e.target.value.trim().toLowerCase(),
                    });
                  }}
                  type="text"
                  placeholder="Enter Username Or Email Id"
                  className="block h-6 p-4 border text-black bg-white border-black dark:border-white rounded-lg font-semibold text-sm mb-2"
                />
                {isEmailVerified && (
                  <>
                    <p className="text-lg text-gray-950 font-semibold dark:text-gray-50 text-left">
                      Enter Otp sent to your registered email
                    </p>
                    <input
                      onChange={(e) => {
                        setUser({
                          ...user,
                          otp: parseInt(e.target.value.trim()),
                        });
                      }}
                      type="number"
                      placeholder="Enter otp"
                      className="block h-6 p-4 border text-black bg-white border-black dark:border-white rounded-lg font-semibold text-sm mb-2"
                    />
                  </>
                )}
              </div>
            )}
            {isOtpVerified && (
              <div className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-50 text-left">
                  Enter New Password
                </p>
                <div className="flex">
                  <input
                    type={hidePassword.button ? "password" : "text"}
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                    }}
                    className="block h-6 p-4 border text-black bg-white border-black dark:border-white rounded-lg font-semibold text-sm mb-2"
                    placeholder="nEwpassword2"
                  />
                  <button
                    onClick={() => {
                      setHidePassword({
                        ...hidePassword,
                        button: !hidePassword.button,
                      });
                    }}
                    className="w-16"
                  >
                    {hidePassword.button ? "Show" : "Hide"}
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-50 text-left">
                  ReEnter new password
                </p>
                <div className="flex">
                  <input
                    type={hidePassword.button2 ? "password" : "text"}
                    onChange={(e) => {
                      setUser({ ...user, confirmPassword: e.target.value });
                    }}
                    placeholder="nEwpassword2"
                    className="block h-6 p-4 border text-black bg-white border-black dark:border-white rounded-lg font-semibold text-sm mb-2"
                  />
                  <button
                    onClick={() => {
                      setHidePassword({
                        ...hidePassword,
                        button2: !hidePassword.button2,
                      });
                    }}
                    className="w-16"
                  >
                    {hidePassword.button2 ? "Show" : "Hide"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center flex-col mt-4">
              <button
                disabled={isDisable}
                onClick={handleClick}
                className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
              >
                {!isEmailVerified && "Send Otp"}
                {isEmailVerified && !isOtpVerified && "Verify Otp"}
                {isEmailVerified && isOtpVerified && "Change Pasword"}
              </button>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-50 text-left text-nowrap">
                  doesn't have an account?
                  <Link to="/signup" className="pl-2">
                    SignUp
                  </Link>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-50 text-left  text-nowrap">
                  remember the password?
                  <Link to="/login" className="pl-2">
                    SignIn
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
