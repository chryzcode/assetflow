"use client";

import Metamask from "@/app/components/Metamask";
import withAuth from "../context/withAuth";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

const DashboardPage = () => {
  const user =  useGetAuthUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullName}</p>
      <Metamask userId={user.id} />
      {user.walletAddress ? <p>Wallet: {user.walletAddress}</p> : <p>No wallet connected</p>}
    </div>
  );
};

export default withAuth(DashboardPage);
