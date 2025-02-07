import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/userContext/usercontext";
import { Helmet } from "react-helmet";
export default function Home() {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState({
    Message: "",
    isGood: true,
  });

  return (
    <>
    <Helmet>
    <title>Welcome To Nexora</title>
    </Helmet>
    <div className="bg-black dark:bg-red-700">
    <p>{user?._id}</p>
  </div>
    </>
  );
}
