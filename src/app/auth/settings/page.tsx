"use client";

import { toast } from "react-toastify";
import withAuth from "@/app/context/withAuth";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { useState, useEffect } from "react";

interface User {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

const EditProfile = () => {
  const user = useGetAuthUser();
  const [formData, setFormData] = useState<User>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName,
        email: user.email,
      }));
    }
  }, [user]); // ✅ Dependencies fixed, no unnecessary updates.

  if (!user) return <p>Loading...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const body = {
        fullName: formData.fullName,
        ...(formData.password ? { password: formData.password } : {}), // ✅ Only include password if provided
      };

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-gray-900 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
          required
          disabled
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (optional)"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="New Password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Confirm New Password"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded font-bold flex items-center justify-center my-6 disabled:opacity-50"
          disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditProfile);
