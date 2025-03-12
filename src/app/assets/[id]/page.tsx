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
  isListed: boolean; // New field
}

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const AssetDetail = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useGetAuthUser();
  const [error, setError] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [buttonState, setButtonState] = useState({
    isListing: false,
    isPurchasing: false,
    listStatus: "List Asset",
    purchaseStatus: "Buy Now",
  });

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
          isListed: assetData.isListed,
        });
        setNewPrice(ethers.formatEther(assetData.price));
      } catch (error) {
        console.error("Error fetching asset:", error);
        setError("Failed to load asset.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  const handleListAsset = async () => {
    if (!asset) return;
    setButtonState(prev => ({
      ...prev,
      isListing: true,
      listStatus: "Listing...",
    }));
    try {
      if (!window.ethereum) {
        console.error("Error:", "Ethereum provider not found");
        toast.error("Please install MetaMask to continue.");
        setButtonState(prev => ({
          ...prev,
          isListing: false,
          listStatus: "List Asset",
        }));
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);
      const tx = await contract.listAsset(
        user.id,
        asset.name,
        asset.description,
        ethers.parseEther(newPrice || asset.price),
        asset.assetUrl
      );
      setButtonState(prev => ({
        ...prev,
        listStatus: "Listing...",
      }));
      toast.info("Listing asset...");
      await tx.wait();
      toast.success("Asset listed successfully!");
      setButtonState(prev => ({
        ...prev,
        isListing: false,
        listStatus: "List Asset",
      }));
    } catch (error: any) {
      console.error("Error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.message?.includes("user rejected transaction")) {
        errorMessage = "Transaction rejected by user.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas fees.";
      } else if (error.message?.includes("revert")) {
        errorMessage = "Transaction reverted. Check contract conditions.";
      } else if (error.message?.includes("invalid argument")) {
        errorMessage = "Invalid input. Please check your data.";
      }
      console.error("Error message:", errorMessage);
      toast.error(errorMessage);
      setButtonState(prev => ({
        ...prev,
        isListing: false,
        listStatus: "List Asset",
      }));
    }
  };

  const handleBuy = async () => {
    if (!asset) return;
    if (!user) {
      toast.error("You must be logged in to purchase an asset.");
      return;
    }

    // Prevent owner from buying their own asset
    if (user.id === asset.userId) {
      toast.error("You cannot purchase your own asset.");
      return;
    }

    setButtonState(prev => ({
      ...prev,
      isPurchasing: true,
      purchaseStatus: "Processing...",
    }));

    try {
      if (!window.ethereum) {
        toast.error("Ethereum provider not found. Please install MetaMask.");
        setButtonState(prev => ({
          ...prev,
          isPurchasing: false,
          purchaseStatus: "Buy Now",
        }));
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);

      const tx = await contract.purchaseAsset(asset.id, user.id, {
        value: ethers.parseEther(asset.price),
      });
      toast.info("Transaction is being processed...");
      await tx.wait();

      // Update the asset ownership in the state
      const userWalletAddress = await signer.getAddress(); // Get the connected wallet address

      setAsset(prev => {
        if (prev) {
          return {
            ...prev,
            currentWallet: userWalletAddress, // Update currentWallet to the connected wallet address
            isSold: true, // Mark the asset as sold
            isListed: false, // Set isListed to false after purchase
            userId: user.id, // Update to the new user's ID
          };
        }
        return null; // Return null if prev is null
      });

      toast.success("Purchase successful!");
      setButtonState(prev => ({
        ...prev,
        isPurchasing: false,
        purchaseStatus: "Buy Now",
      }));
    } catch (error: any) {
      console.error("Error purchasing asset:", error);
      toast.error(error?.message || "An unknown error occurred");
      setButtonState(prev => ({
        ...prev,
        isPurchasing: false,
        purchaseStatus: "Buy Now",
      }));
    }
  };

  if (isLoading) return <p className="text-center text-gray-400">Loading asset...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!asset) return <p className="text-gray-400 text-center">Asset not found.</p>;

  const isOwner = user && user.id === asset.userId;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
            {isOwner && !asset.isListed ? (
              <span className="text-blue-500">Owned</span>
            ) : asset.isSold ? (
              <span className="text-red-500">Sold</span>
            ) : isOwner && asset.isListed ? (
              <span className="text-yellow-500">Listed</span>
            ) : (
              <span className="text-green-500">Available</span>
            )}
          </div>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mt-4 md:mt-0">{asset.price} ETH</p>
          </div>
          <hr className="my-4" />
          <p className="text-gray-700 text-lg leading-relaxed">{asset.description}</p>
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

          {isOwner && !asset.isListed && (
            <div className="mt-4">
              <label className="block text-gray-700">
                Set New Price - ETH <small className="text-xs">(optional)</small>
              </label>
              <input
                type="text"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full p-3 mb-4 text-gray-800 rounded border mt-2"
              />
              <button
                className={`w-full py-4 rounded-lg text-white font-bold transition-all duration-300 ${
                  buttonState.isListing ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleListAsset}
                disabled={buttonState.isListing}>
                {buttonState.listStatus}
              </button>
            </div>
          )}

          {!isOwner && !asset.isSold && asset.isListed && (
            <button
              className={`w-full py-4 rounded-lg text-white font-bold transition-all duration-300 ${
                buttonState.isPurchasing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleBuy}
              disabled={buttonState.isPurchasing}>
              {buttonState.purchaseStatus}
            </button>
          )}

          {isOwner && asset.isSold && !asset.currentWallet.toLowerCase() === user.id.toLowerCase() && (
            <button className="w-full py-4 rounded-lg text-white font-bold bg-gray-500 cursor-not-allowed" disabled>
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
