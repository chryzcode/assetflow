import React, { useState } from "react";
import { ethers } from "ethers";
import AssetMarketplace from "../../smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
interface AssetListingFormProps {
  user?: { walletAddress?: string; id?: number }; // Ensure the user object contains walletAddress
}
const API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
const API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET as string;

const AssetListingForm: React.FC<AssetListingFormProps> = ({ user }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    assetName: "",
    assetDescription: "",
    assetPrice: "",
    assetFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect user to dashboard if they don't have a wallet connected
  if (!user?.walletAddress) {
    toast.error("Please connect your wallet to list an asset", { autoClose: 5000 });
    router.push("/dashboard"); // Redirect to dashboard for wallet setup
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const metadata = JSON.stringify({ name: file.name });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({ cidVersion: 0 });
    formData.append("pinataOptions", options);
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
        },
      });
      return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      toast.error("Failed to upload file");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.assetFile) throw new Error("No file selected!");
      const assetURI = await uploadToIPFS(formData.assetFile);
      if (!assetURI) throw new Error("IPFS upload failed");

      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);

      // Ensure user.id is defined before proceeding
      if (!user?.id) {
        throw new Error("User ID is required for listing assets");
      }

      const priceInWei = ethers.parseEther(formData.assetPrice);
      const transaction = await contract.listAsset(
        0, //
        user.id, // Owner's user ID
        formData.assetName,
        formData.assetDescription,
        priceInWei,
        assetURI
      );
      await transaction.wait();
      toast.success("Asset listed successfully!");
      router.push("/assets/my-assets");
    } catch (error: any) {
      console.error("Error listing asset:", error);
      toast.error(error?.message || "Error listing asset on-chain");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">List Your Asset</h2>
        <input
          type="text"
          name="assetName"
          placeholder="Asset Name"
          value={formData.assetName}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <textarea
          name="assetDescription"
          placeholder="Asset Description"
          value={formData.assetDescription}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <input
          type="number"
          name="assetPrice"
          placeholder="Asset Price in ETH"
          value={formData.assetPrice}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <input
          type="file"
          name="assetFile"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded">
          {isSubmitting ? "Listing..." : "List Asset"}
        </button>
      </form>
    </div>
  );
};

export default AssetListingForm;
