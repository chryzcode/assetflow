"use client";

import { connectMetaMask } from "@/lib/metamask";
import { useState } from "react";
import { toast } from "react-toastify";

interface MetamaskProps {
  userId: string;
  userWalletAddress: string;
}

const Metamask: React.FC<MetamaskProps> = ({ userId, userWalletAddress }) => {
  const [wallet, setWallet] = useState(userWalletAddress);

  const handleConnectWallet = async () => {
    try {
      const walletAddress = await connectMetaMask(userId);
      setWallet(walletAddress);
      toast.success(`Wallet updated: ${walletAddress}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  return (
    <button onClick={handleConnectWallet} className="text-green-400 border-b-2 border-green-400 my-2">
      {wallet ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
};

export default Metamask;
