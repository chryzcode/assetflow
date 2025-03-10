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

  // Listen for account changes and update Firestore if the wallet changes
  window.ethereum.on("accountsChanged", async (accounts: string[]) => {
    if (accounts.length === 0) return; // No account selected
    const newWalletAddress = accounts[0];

    // Query Firestore to find the user by their `id`
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("id", "==", userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0].ref;
      await updateDoc(userDoc, { walletAddress: newWalletAddress });
    }
  });

  return walletAddress;
};
