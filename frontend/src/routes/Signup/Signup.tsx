/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { FileUpload } from "../../components/ui/file-upload";
import axios from "axios";
interface userDetaill {
  FirstName: string;
  LastName: string;
  Email: string;
  UserName: string;
  Password: string;
  ProfilePicture: File;
}
export default function Signup() {
  const [user, setUser] = useState<userDetaill>({
    FirstName: "",
    LastName: "",
    Email: "",
    UserName: "",
    Password: "",
    ProfilePicture: null as unknown as File,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [seePassword, setSeePassword] = useState<boolean>(false);

  const [message, setMessage] = useState({
    Message: "",
    isGood: false,
  });
  useEffect(() => {
    if (
      loading ||
      user.FirstName.trim().length === 0 ||
      user.LastName.trim().length === 0 ||
      user.Email.trim().length === 0 ||
      user.Password.trim().length === 0
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [loading, user]);

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    setUser({ ...user, ProfilePicture: file });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(user)
      const formData = new FormData();
      formData.append("FirstName", user.FirstName);
      formData.append("LastName", user.LastName);
      formData.append("Email", user.Email);
      formData.append("UserName", user.UserName);
      formData.append("Password", user.Password);

      if (user.ProfilePicture) {
        formData.append("ProfilePicture", user.ProfilePicture);
      }
      console.log("Form Data ", formData);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage({ Message: "Registration successful", isGood: true });
      }
    } catch (error: any) {
      setMessage({
        Message: error.response?.data?.message || error.message,
        isGood: false,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-center text-xl text-black dark:text-neutral-200">
        Welcome to Steller Forge
      </h2>
      <p className="text-black text-center text-sm max-w-sm mt-2 dark:text-neutral-300">
        You Have To Create An Account To Get The Features
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="form-label required">
              First name
            </Label>
            <Input
              id="firstname"
              placeholder="Sandeep"
              type="text"
              onChange={(e: any) => {
                setUser({ ...user, FirstName: e.target.value.trim() });
              }}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Mohapatra"
              type="text"
              onChange={(e: any) => {
                setUser({ ...user, LastName: e.target.value.trim() });
              }}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            onChange={(e: any) => {
              setUser({ ...user, Email: e.target.value.trim() });
            }}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">UserName</Label>
          <Input
            id="username"
            placeholder="S@ndeep002"
            type="text"
            onChange={(e: any) => {
              setUser({ ...user, UserName: e.target.value.trim() });
            }}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="flex items-center">
            <Input
              id="password"
              placeholder="password"
              type={seePassword ? "text" : "password"}
              onChange={(e: any) => {
                setUser({ ...user, Password: e.target.value.trim() });
              }}
            />
            <button
              onClick={() => {
                setSeePassword(!seePassword);
              }}
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-1/5 text-white rounded-md h-8 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
              {!seePassword ? "See" : "Hide"}
            </button>
          </div>
        </LabelInputContainer>
        <FileUpload onChange={handleFileUpload} />

        <button
        disabled={isDisable}
          onClick={handleSubmit}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-50 text-center p-2">
          doesn't have an account?
          <Link to="/login">SignIn</Link>
        </p>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-black dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-black dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-highlight to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
