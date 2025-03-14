"use client"

import Services from "./components/Services";
import PartnersSlider from "./components/Partners";
import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated } = state;

  return (
    <>
      <header className="text-center py-20">
        <div className="relative w-full h-full flex items-center justify-center mx-auto container">
          <h1
            className="text-5xl font-bold uppercase tracking-wide text-transparent bg-clip-text md:text-6xl"
            style={{
              backgroundImage: "url('/assets/text-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Empowering Seamless Asset Management and Trading
          </h1>
        </div>
        <p className="text-center pt-8 text-blue-500 font-bold">(all on Sepolia testnet)</p>
        <div className="px-10 md:px-20 m-16 flex flex-col md:flex-row items-center justify-center md:justify-between max-w-6xl mx-auto container gap-6">
          <p className="text-gray-300 text-lg w-full md:w-3/5 text-center md:text-left">
            AssetFlow revolutionizes asset management by leveraging blockchain technology for secure, transparent, and
            efficient transactions. Whether you're buying, selling, or managing assets, our platform ensures seamless
            ownership transfers, real-time price updates, and effortless listing and delisting.
          </p>

          <Link
            href={isAuthenticated ? "/assets" : "/auth/register"}
            className="bg-blue-500 px-8 py-4 text-white font-bold flex items-center justify-center shadow-lg hover:bg-blue-600 transition">
            <p>{isAuthenticated ? "View Marketplace" : "Get Started"}</p>
            <span className="material-icons animate-arrow ml-2">arrow_forward</span>
          </Link>
        </div>

        <div className="flex justify-center items-center flex-col mt-24">
          <p className="text-gray-300 text-sm my-4">Scroll</p>
          <span className="material-icons animate-bounce">arrow_downward</span>
        </div>
        <PartnersSlider />
      </header>

      <Services />

      <div className="px-10 md:px-20 flex flex-col items-center justify-center mx-auto text-center my-20 container">
        <h1 className="text-4xl font-bold text-blue-300">Start Managing Your Assets Today</h1>
        <p className="text-gray-300 text-xl py-5">
          Ready to take control of your assets with security and transparency? Get started with Asset Flow today and
          revolutionize how you manage, track, and transfer your assets.
        </p>

        <div className="my-10">
          <Link
            href={isAuthenticated ? "/assets" : "/auth/register"}
            className="mt-6 md:mt-0 bg-blue-500 px-8 py-4 text-white font-bold flex items-center shadow-lg hover:bg-blue-600 transition">
            {isAuthenticated ? "View Marketplace" : "Get Started"}
            <span className="material-icons animate-arrow ml-2">arrow_forward</span>
          </Link>
        </div>
      </div>
      <span className="text-center block">
        Built by{" "}
        <Link
          className="text-blue-500 underline"
          href="https://chryzcode.netlify.app/"
          target="_blank"
          rel="noopener noreferrer">
          chryzcode
        </Link>
      </span>
    </>
  );
}
