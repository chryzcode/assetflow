"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import AssetMarketplace from "../../smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import ipfsLoader from "@/lib/ipfsLoader"; // 

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

const Marketplace = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
        const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);

        // Fetch asset count
        const assetCount = await contract.getAssetCounter();
        if (assetCount === 0) {
          setAssets([]);
          setIsLoading(false);
          return;
        }

        const assetList: Asset[] = [];
        for (let i = 1; i <= assetCount; i++) {
          try {
            const asset = await contract.assets(i);
            assetList.push({
              id: i,
              name: asset.name,
              description: asset.description,
              price: ethers.formatEther(asset.price),
              assetUrl: asset.assetUrl,
              userId: asset.userId,
              currentWallet: asset.currentWallet,
              isSold: asset.isSold,
            });
          } catch (err) {
            console.warn(`Skipping missing asset ${i}:`, err);
          }
        }
        setAssets(assetList);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleBuy = async (assetId: number, price: string) => {
    try {
      if (!window.ethereum) {
        toast.error("Ethereum provider not found. Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);
      const userId = "example-user-id"; // Replace with actual user ID

      const tx = await contract.purchaseAsset(assetId, userId, {
        value: ethers.parseEther(price),
      });

      toast.info("Transaction is being processed...");
      await tx.wait();

      toast.success("Purchase successful!");
    } catch (error: any) {
      console.error("Error purchasing asset:", error);

      if (error.code === "ACTION_REJECTED") {
        toast.warning("Transaction rejected by user.");
      } else {
        toast.error(error?.message || "An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading assets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {assets.map(asset => (
            <div key={asset.id} className="border p-4 rounded-lg shadow-lg">
              <Image
                loader={ipfsLoader}
                src={asset.assetUrl}
                alt={asset.name}
                width={200}
                height={200}
                layout="intrinsic"
              />{" "}
              <h2 className="text-xl font-semibold mt-2">{asset.name}</h2>
              <p className="text-gray-600 text-sm">{asset.description}</p>
              <p className="text-lg font-bold mt-2">{asset.price} ETH</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={asset.isSold}
                onClick={() => handleBuy(asset.id, asset.price)}>
                {asset.isSold ? "Sold" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
