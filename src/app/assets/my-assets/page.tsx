"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import AssetMarketplace from "@/smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import withAuth from "../../context/withAuth";
import { useGetAuthUser } from "@/lib/useGetAuthUser";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;


// Define the Asset type to prevent TypeScript errors
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
            const provider = new ethers.JsonRpcProvider(
              `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`
            );
            const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);

            const userAssets = await contract.getUserAssets(userId);
            
            // Map the response to match the Asset type
            const formattedAssets = userAssets.map((asset: any, index: number) => ({
                id: index + 1, // Contract may not return an id, so we generate one
                name: asset.name,
                description: asset.description,
                price: asset.price.toString(), // Ensure price is a string for formatting
                assetUrl: asset.assetUrl,
                owner: asset.owner,
                isSold: asset.isSold
            }));

            setAssets(formattedAssets);
        } catch (error) {
            console.error("Error fetching assets:", error);
        }
    };

    return (
      <div>
        <h1>Your Listed Assets</h1>
        {assets.length > 0 ? (
          assets.map(asset => (
            <div key={asset.id} className="p-4 border border-gray-700 rounded">
              <h3>{asset.name}</h3>
              <p>{asset.description}</p>
              <p>Price: {ethers.formatEther(asset.price)} ETH</p>
              <Image src={getIPFSUrl(asset.assetUrl)} alt={asset.name} width={200} height={200} layout="intrinsic" />
            </div>
          ))
        ) : (
          <p>No assets listed yet.</p>
        )}
      </div>
    );
};

export default withAuth(ListAssetPage);
