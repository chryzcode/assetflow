import React, { useState } from "react";
import { ethers } from "ethers";
// import AssetMarketplace from "../artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace after deployment

const AssetListingForm = () => {
  const [formData, setFormData] = useState({
    assetName: "",
    assetDescription: "",
    assetPrice: "",
    assetFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      alert("MetaMask not detected!");
    }
  };

  const uploadToIPFS = async (file: File) => {
    // Placeholder function (you can integrate Pinata or Web3.Storage here)
    return "ipfs://fakehash";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assetURI = await uploadToIPFS(formData.assetFile!);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, signer);

      const priceInWei = ethers.utils.parseEther(formData.assetPrice);

      const transaction = await contract.listAsset(formData.assetName, formData.assetDescription, assetURI, priceInWei);
      await transaction.wait();
      alert("Asset listed successfully!");
    } catch (error) {
      console.error("Error listing asset:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">List Your Asset</h2>
        <button
          type="button"
          onClick={connectWallet}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mb-4">
          Connect Wallet
        </button>
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
