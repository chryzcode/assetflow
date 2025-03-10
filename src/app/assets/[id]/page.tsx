"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import Image from "next/image";
import AssetMarketplace from "../../../smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import ipfsLoader from "@/lib/ipfsLoader";
import { toast } from "react-toastify";
import { maskWalletAddress } from "@/lib/maskWalletAddress";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

interface Asset {
  id: number;
  name: string;
  description: string;
  price: string;
  assetUrl: string;
  userId: string;
  currentWallet: string;
  isSold: boolean;
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const AssetDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useGetAuthUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
        const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);
        const assetData = await contract.assets(Number(id));

        setAsset({
          id: Number(id),
          name: assetData.name,
          description: assetData.description,
          price: ethers.formatEther(assetData.price),
          assetUrl: assetData.assetUrl,
          userId: assetData.userId,
          currentWallet: assetData.currentWallet,
          isSold: assetData.isSold,
        });
      } catch (error) {
        console.error("Error fetching asset:", error);
        setError("Failed to load asset.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleBuy = async () => {
    if (!asset) return;
    if (!user) {
      toast.error("You must be logged in to purchase an asset.");
      return;
    }
    try {
      if (!window.ethereum) {
        toast.error("Ethereum provider not found. Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);
      // Use user.id as the buyer's identifier
      const tx = await contract.purchaseAsset(asset.id, user.id, {
        value: ethers.parseEther(asset.price),
      });

      toast.info("Transaction is being processed...");
      await tx.wait();
      toast.success("Purchase successful!");
    } catch (error: any) {
      console.error("Error purchasing asset:", error);
      toast.error(error?.message || "An unknown error occurred");
    }
  };

  if (isLoading) return <p className="text-center text-gray-400">Loading asset...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!asset) return <p className="text-gray-400 text-center">Asset not found.</p>;

  // Check if the authenticated user is the owner of the asset
  const isOwner = user && user.id === asset.userId;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <div className="w-full h-96 bg-gray-200 relative">
            <Image
              loader={ipfsLoader}
              src={asset.assetUrl}
              alt={asset.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              draggable="false"
            />
          </div>
          <div className="absolute top-4 left-4 bg-white rounded-md px-3 py-1 text-sm font-medium shadow-md">
            {isOwner ? (
              <span className="text-blue-500">Owned</span>
            ) : asset.isSold ? (
              <span className="text-red-500">Sold</span>
            ) : (
              <span className="text-green-500">Available</span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mt-4 md:mt-0">{asset.price} ETH</p>
          </div>
          <hr className="my-4" />

          <p className="text-gray-700 text-lg leading-relaxed">{asset.description}</p>

          {/* Asset Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-gray-500 text-sm">Owner</p>
              <p className="text-gray-800">{maskWalletAddress(asset.currentWallet)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">User ID</p>
              <p className="text-gray-800">{asset.userId}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            {isOwner ? (
              <button className="w-full py-4 rounded-lg bg-gray-600 text-white font-bold cursor-default" disabled>
                You Own This Asset
              </button>
            ) : (
              <button
                className={`w-full py-4 rounded-lg text-white font-bold transition-all duration-300 ${
                  asset.isSold ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={asset.isSold}
                onClick={handleBuy}>
                {asset.isSold ? "Sold Out" : "Buy Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
