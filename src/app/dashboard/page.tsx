"use client";

import React, { useEffect, useState, useCallback } from "react";
import Metamask from "@/app/components/Metamask";
import withAuth from "../context/withAuth";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import AssetMarketplace from "@/smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const DashboardPage = () => {
  const user = useGetAuthUser();
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [userAssets, setUserAssets] = useState<
    {
      id: number;
      name: string;
      description: string;
      price: string;
      assetUrl: string;
      owner: string;
      isSold: boolean;
    }[]
  >([]);

  const [transactions, setTransactions] = useState<
    {
      hash: string;
      value: string;
      timeStamp: string;
    }[]
  >([]);


  // Determine greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ☀️";
    if (hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

  // Fetch wallet balance (Memoized)
  const fetchWalletBalance = useCallback(async () => {
    if (!user?.walletAddress) return;

    try {
      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
      const balance = await provider.getBalance(user.walletAddress);
      setWalletBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch wallet balance.");
    }
  }, [user?.walletAddress]);

  // Fetch user's assets from blockchain (Memoized)
  const fetchUserAssets = useCallback(async () => {
    if (!user?.id) return;

    try {
      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);
      const assets = await contract.getUserAssets(user.id);

      setUserAssets(
        assets.map((asset: any, index: number) => ({
          id: index + 1,
          name: asset.name,
          price: ethers.formatEther(asset.price),
        }))
      );
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets.");
    }
  }, [user?.id]);

  // Fetch user's recent transactions from Etherscan API (Memoized)
  const fetchTransactions = useCallback(async () => {
    if (!user?.walletAddress) return;

    try {
      const res = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${user.walletAddress}&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "1") {
        setTransactions(
          data.result.slice(0, 5).map((tx: any) => ({
            hash: tx.hash,
            value: ethers.formatEther(tx.value),
            timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions.");
    }
  }, [user?.walletAddress]);

  useEffect(() => {
    if (user?.walletAddress) {
      fetchWalletBalance();
      fetchUserAssets();
      fetchTransactions();
    }
  }, [user?.walletAddress, fetchWalletBalance, fetchUserAssets, fetchTransactions]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold">
        {getGreeting()}, {user.fullName} 👋
      </h1>
      <p className="text-gray-400 mt-2">Welcome back to your dashboard!</p>

      {/* Wallet Section */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-medium">Wallet Information</h2>
        <p className="text-gray-300">
          Wallet Address:{" "}
          {user.walletAddress ? (
            <span className="text-green-400">{user.walletAddress}</span>
          ) : (
            <span className="text-red-400">Not connected</span>
          )}
        </p>
        <p className="text-lg font-bold mt-2">Balance: {walletBalance} ETH</p>
        <Metamask userId={user.id} />
      </div>

      {/* Assets Section */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-medium">Your Assets</h2>
        {userAssets.length > 0 ? (
          <ul className="mt-2">
            {userAssets.map(asset => (
              <li key={asset.id} className="border-b border-gray-700 py-2">
                <span className="font-semibold">{asset.name}</span> - {asset.price} ETH
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You don't own any assets yet.</p>
        )}
      </div>

      {/* Transactions Section */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <ul className="mt-2">
            {transactions.map(tx => (
              <li key={tx.hash} className="border-b border-gray-700 py-2">
                <p>
                  <span className="font-semibold">Hash:</span>{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline">
                    {tx.hash.substring(0, 10)}...
                  </a>
                </p>
                <p>Amount: {tx.value} ETH</p>
                <p className="text-gray-400 text-sm">Date: {tx.timeStamp}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No recent transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
