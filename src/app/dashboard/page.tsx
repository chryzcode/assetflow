"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import Metamask from "@/app/components/Metamask";
import withAuth from "../context/withAuth";

// Define the expected shape of the user object
interface User {
  id: string;
  walletAddress?: string;
  fullName: string;
}

// Define the shape of the decoded JWT payload
interface DecodedToken {
  userId: string; // Ensure this matches your JWT payload structure
}

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Decode the token to extract userId
        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded?.userId;

        if (!userId) {
          console.error("Invalid token: Missing userId");
          return;
        }

        // Fetch user by userId
        const response = await fetch(`/api/user/detail?userId=${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>; // Prevent rendering before data loads

  return (
    <div>
      <h1>Dashboard</h1>

      {/* MetaMask Wallet Component */}
      <Metamask userId={user?.id} />
      {user && <p>Connected Wallet: {user.fullName}</p>}

      {/* Conditional Rendering for Wallet */}
      {user?.walletAddress ? <p>Wallet: {user.walletAddress}</p> : <p>No wallet connected</p>}
    </div>
  );
};

export default withAuth(DashboardPage);
