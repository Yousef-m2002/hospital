"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://egyptos.runasp.net/api/Auth/ForgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"  
        },
        body: JSON.stringify({
          email: email.trim()  
        }),
      });
      

      const data = await response.json();
      if (response.ok) {
        setMessage("✅A password reset link has been sent to your email.");
        setTimeout(() => router.push("http://localhost:3000//auth/signin"), 5000);
      } else {
        setError(data.message || "❌ An error occurred, please try again later.");
      }
    } catch (err) {
      setError("❌ An error occurred while sending.");
      console.error("🚨 Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100 px-4"
      style={{
        backgroundImage: "url('/backs.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="bg-[#FFFFFFB8] bg-opacity-75 p-6 rounded-xl shadow-xl max-w-[90%] sm:w-[457px]">
        <h2 className="text-[20px] sm:text-[24px] py-2 font-bold text-center text-[#04234e] mb-4">
          Reset your password
        </h2>
        <p className="text-gray-600 text-center mb-2 text-[14px] sm:text-[16px]">
          Enter your email and we will send you a link to reset your password
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-[90%] sm:w-[409px] mx-auto">
          <div className="w-full mt-3 relative">
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="   my-3 shadow-[0px_4px_6px_rgba(0,0,0,0.25)]
                        w-full h-[48px] bg-white sm:h-[51px] placeholder-[#376c89] pl-[55px] sm:pl-[65px] pr-6 rounded-[8px] outline-none text-[14px] sm:text-[16px]"
            />
            <UserIcon className="absolute  p-2 bg-white text-[#376c89] rounded-full left-2 sm:left-4 top-[50%] transform -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 shadow-md" />
          </div>
  
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
          <div className="w-full max-w-[189px] mx-auto h-[46px]">
            <button
              type="submit"
              className="w-full h-full bg-[#376c89] cursor-pointer rounded-[8px] text-white text-[18px] sm:text-[20px] hover:bg-[#376c89c0] transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset"}
            </button>
          </div>
        </form>
  
        <div className="text-center mt-4">
          <Link href="/auth/signin" className="text-[#020032] font-medium hover:text-[#376c89] underline">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
  
}
