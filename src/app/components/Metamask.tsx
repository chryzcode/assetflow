"use client";

import { connectMetaMask } from "@/lib/metamask";
import { useState } from "react";
import { toast } from "react-toastify";

interface MetamaskProps {
  userId: string;
}

const Metamask: React.FC<MetamaskProps> = ({ userId }) => {
  const [wallet, setWallet] = useState("");

  const handleConnectWallet = async () => {
    try {
      const walletAddress = await connectMetaMask(userId);
      setWallet(walletAddress);
      toast.success(`Connected: ${walletAddress}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <button onClick={handleConnectWallet}>
      {wallet ? `Connected: ${wallet}` : "Connect MetaMask"}
    </button>
  );
};

export default Metamask;
