import { ethers } from "ethers";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
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

  // Query Firestore to find the user by their `id` field
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("id", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("User not found");
  }

  // Get the first matching document and update the wallet address
  const userDoc = snapshot.docs[0].ref;
  await updateDoc(userDoc, { walletAddress });

  return walletAddress;
};