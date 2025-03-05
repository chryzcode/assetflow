"use client"

import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Forgot Password?</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
          autoComplete="email"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded font-bold flex items-center justify-center my-6 disabled:opacity-50"
          disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="text-white text-sm mt-4 text-center">
          Remember your password?{" "}
          <a href="/auth/login" className="text-blue-500 font-bold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
