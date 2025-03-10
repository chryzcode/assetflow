"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true); // Set loading state before making the request

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      toast.success("Registration successful! Check your email.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/auth/login");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false); // Ensure loading state is reset after request
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Retype Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-2 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded font-bold flex items-center justify-center my-6"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-white text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
