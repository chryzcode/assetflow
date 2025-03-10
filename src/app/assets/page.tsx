"use client";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import AssetMarketplace from "../../smartContract/artifacts/contracts/AssetMarketplace.sol/AssetMarketplace.json";
import ipfsLoader from "@/lib/ipfsLoader";
import Link from "next/link";
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

const Marketplace = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blackout, setBlackout] = useState(false);
    const user = useGetAuthUser();

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
                const contract = new ethers.Contract(contractAddress, AssetMarketplace.abi, provider);
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
            const userId = user.id
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

    useEffect(() => {
        const blockScreenshot = (event: KeyboardEvent) => {
            if (event.key === "PrintScreen") {
                event.preventDefault();
                setBlackout(true); // Trigger blackout
                setTimeout(() => setBlackout(false), 2000); // Remove blackout after 2 seconds
                toast.warning("Screenshots are disabled on this page.");
            }
        };
        
        const disableDevTools = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === "I") event.preventDefault();
            if (event.key === "F12") {
                event.preventDefault();
                setBlackout(true); // Trigger blackout
                setTimeout(() => setBlackout(false), 2000); // Remove blackout after 2 seconds
                toast.warning("Developer tools are disabled.");
            }
        };
        
        const detectVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setBlackout(true); // Blackout when tab is hidden
                toast.warning("Screen recording or screenshots are not allowed.");
            } else {
                setBlackout(false);
            }
        };

        document.addEventListener("keydown", blockScreenshot);
        document.addEventListener("keydown", disableDevTools);
        document.addEventListener("visibilitychange", detectVisibilityChange);

        return () => {
            document.removeEventListener("keydown", blockScreenshot);
            document.removeEventListener("keydown", disableDevTools);
            document.removeEventListener("visibilitychange", detectVisibilityChange);
        };
    }, []);

    return (
        <div className="container mx-auto p-6 relative">
            {/* Blackout Overlay */}
            {blackout && <div className="fixed inset-0 bg-black opacity-90 z-50"></div>}
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            
            {isLoading ? (
                <p className="text-center text-gray-400">Loading assets...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
                    {assets.map(asset => (
                        <Link href={`/assets/${asset.id}`}
                            key={asset.id}
                            className="bg-gray-900 p-4 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 relative overflow-hidden"
                        >
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
                            <button
                                className={`mt-4 w-full text-white py-2 rounded-xl transition-all duration-300
                                    ${asset.isSold ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                disabled={asset.isSold}
                                onClick={() => handleBuy(asset.id, asset.price)}
                            >
                                {asset.isSold ? "Sold" : "Buy Now"}
                            </button>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;