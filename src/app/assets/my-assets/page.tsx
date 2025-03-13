"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import AssetMarketplace from "@/smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import withAuth from "../../context/withAuth";
import { useGetAuthUser } from "@/lib/useGetAuthUser";
import ipfsLoader from "@/lib/ipfsLoader";
import { toast } from "react-toastify";
import Link from "next/link";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

type Asset = {
  id: number;
  name: string;
  description: string;
  price: string;
  assetUrl: string;
  owner: string;
  isSold: boolean;
  isListed: boolean;
};

const ListAssetPage = () => {
  const user = useGetAuthUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"owned" | "listed" | "bought">("owned");

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchUserAssets(userId);
    }
  }, [userId]);

  const fetchUserAssets = async (userId: string) => {
    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);
      const userAssets = await contract.getUserAssets(userId);
      const formattedAssets = userAssets.map((asset: any, index: number) => ({
        id: index + 1,
        name: asset.name,
        description: asset.description,
        price: ethers.formatEther(asset.price),
        assetUrl: asset.assetUrl,
        owner: asset.userId,
        isSold: asset.isSold,
        isListed: asset.isListed,
      }));
      console.log(formattedAssets);
      setAssets(formattedAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAssets = () => {
    return assets.filter(asset => {
      switch (filter) {
        case "owned":
          return asset.owner.toLowerCase() === userId.toLowerCase() && !asset.isListed ;
        case "listed":
          return asset.isListed && asset.owner.toLowerCase() === userId.toLowerCase() && !asset.isSold;
        default:
          return true;
      }
    });
  };

  return (
    <div className="container mx-auto p-6 my-10">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("owned")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === "owned" ? "bg-blue-600 text-white" : "bg-gray-500 hover:bg-gray-700"
          }`}>
          Owned Assets
        </button>
        <button
          onClick={() => setFilter("listed")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === "listed" ? "bg-blue-600 text-white" : "bg-gray-500 hover:bg-gray-700"
          }`}>
          Listed Assets
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-400">Loading assets...</p>
      ) : getFilteredAssets().length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {getFilteredAssets().map(asset => (
            <Link
              href={`/assets/${asset.id}`}
              key={asset.id}
              className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 relative overflow-hidden">
              <div className="relative w-full h-52 bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  loader={ipfsLoader}
                  src={asset.assetUrl}
                  alt={asset.name}
                  layout="fill"
                  objectFit="cover"
                  className="select-none pointer-events-none"
                  draggable="false"
                />
              </div>
              <h2 className="text-xl font-semibold mt-3 text-white">{asset.name}</h2>
              <p className="text-lg font-bold mt-3 text-blue-400">{asset.price} ETH</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No assets found matching the current filter.</p>
      )}
    </div>
  );
};

export default withAuth(ListAssetPage);
