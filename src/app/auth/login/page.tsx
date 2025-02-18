"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useAuth();

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

      // Store token securely (Consider using httpOnly cookies)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id: data.user.id }));

      dispatch({
        type: "LOGIN",
        payload: { token: data.token, user: { id: data.user.id } },
      });

      toast.success("Login successful");
      setFormData({ email: "", password: "" });
      router.push("/dashboard");
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
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        <p className="text-white text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-500 font-bold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
