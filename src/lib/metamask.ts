import { ethers } from "ethers";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectMetaMask = async (userId: string) => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();

  // Update user in Firestore with wallet address
  await updateDoc(doc(db, "users", userId), { walletAddress });

  return walletAddress;
};
