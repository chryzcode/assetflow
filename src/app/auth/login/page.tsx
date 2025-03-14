"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useAuth();

  useEffect(() => {
    const verifiedStatus = searchParams.get("verified");

    if (verifiedStatus) {
      if (verifiedStatus === "success") {
        toast.success("Account verified successfully! You can now log in.");
      } else if (verifiedStatus === "failed") {
        toast.error("Verification failed. Please try again.");
      }

      // Remove the query parameter from the URL after showing the toast
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      dispatch({ type: "ERROR", payload: "Email and Password are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id: data.user.id }));

      dispatch({
        type: "LOGIN",
        payload: { token: data.token, user: { id: data.user.id } },
      });

      router.push("/dashboard");
      toast.success("Login successful");
      setFormData({ email: "", password: "" });
    } catch (error: unknown) {
      dispatch({
        type: "ERROR",
        payload: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Password"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded font-bold flex items-center justify-center my-6 disabled:opacity-50"
          disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
        <p className="text-white text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-500 font-bold hover:underline">
            Register
          </Link>
        </p>

        <p className="text-center mt-2">
          <Link
            href="/auth/forgot-password"
            className="text-blue-500 font-bold hover:underline text-sm mt-4 text-center">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
