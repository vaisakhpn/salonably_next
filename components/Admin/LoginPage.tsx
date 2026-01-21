"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginUser = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = "/api/admin/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Cookies are set by the server.
       
          // Refresh the page to allow the server component to re-verify the cookie and render the dashboard
          router.refresh();
     
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <Link href="/" className="text-blue-500 underline">
          Home
        </Link>
        <p className="text-2xl gap-3 font-semibold m-auto">
          <span className="text-blue-500"> Admin </span>
          Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button
          disabled={loading}
          className="bg-blue-500 cursor-pointer text-white w-full py-2 rounded-md text-base hover:bg-blue-600 transition-colors disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
       
      </div>
    </form>
  );
};

export default LoginUser;
