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

// Define the Asset type
type Asset = {
  id: number;
  name: string;
  description: string;
  price: string;
  assetUrl: string;
  owner: string;
  isSold: boolean;
};

const ListAssetPage = () => {
  const user = useGetAuthUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

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

  const getIPFSUrl = (ipfsUrl: string) => {
    if (ipfsUrl.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${ipfsUrl.slice(7)}`;
    }
    return ipfsUrl;
  };

  const fetchUserAssets = async (userId: string) => {
    try {
      setIsLoading(true); // Start loading
      const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);

      const userAssets = await contract.getUserAssets(userId);

      const formattedAssets = userAssets.map((asset: any, index: number) => ({
        id: index + 1, // Generate an ID if the contract doesn't provide one
        name: asset.name,
        description: asset.description,
        price: asset.price.toString(),
        assetUrl: asset.assetUrl,
        owner: asset.owner,
        isSold: asset.isSold,
      }));

      setAssets(formattedAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mx-auto p-6 my-10">
      {isLoading ? (
        <p className="text-center text-gray-400">Loading assets...</p>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {assets.map(asset => (
            <Link href={`/assets/${asset.id}`}
              key={asset.id}
              className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 relative overflow-hidden">
              {/* Image Wrapper with No Download */}
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
        <p className="text-center text-gray-400">No assets listed yet.</p>
      )}
    </div>
  );
};

export default withAuth(ListAssetPage);
