"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Metamask from "@/app/components/Metamask";

const DashboardPage = () => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent rendering while redirecting

  return (
    <div>
      <h1>Dashboard</h1>
      {/* MetaMask Wallet Component */}
      <Metamask userId={user?.id} />
    </div>
  );
};

export default DashboardPage;
