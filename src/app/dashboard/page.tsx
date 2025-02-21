"use client";

import Metamask from "@/app/components/Metamask";
import withAuth from "../context/withAuth";
import {getAuthUser} from "@/lib/getAuthUser";

const DashboardPage = () => {
  const user = getAuthUser();

  if (!user) return <p>Loading...</p>; // Prevent rendering before data loads

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullName}</p> 
      {/* MetaMask Wallet Component */}
      <Metamask userId={user?.id} />
      {/* Conditional Rendering for Wallet */}
      {user?.walletAddress ? <p>Wallet: {user.walletAddress}</p> : <p>No wallet connected</p>}
    </div>
  );
};

export default withAuth(DashboardPage);
