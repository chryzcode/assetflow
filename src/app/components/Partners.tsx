"use client";
import Image from "next/image";

const partners = [
  { name: "Infura", src: "/assets/logos/infura.svg" },
  { name: "MetaMask", src: "/assets/logos/metamask.svg" },
  { name: "Ethereum", src: "/assets/logos/ethereum.svg" },
  { name: "EtherScan", src: "/assets/logos/etherscan.svg" },
  { name: "Pinata", src: "/assets/logos/pinata.svg" },
  { name: "Firebase", src: "/assets/logos/firebase.svg" },
];

const PartnersSection = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-blue-700 my-8 py-10 px-4">
      {/* Title with dynamic text size */}
      <p className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
        PARTNERS
      </p>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 items-center">
        {partners.map((partner, index) => (
          <div key={index} className="flex justify-center">
            <Image
              src={partner.src}
              alt={partner.name}
              width={80}  // Default for smaller screens
              height={40}
              className="object-contain sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16 grayscale hover:grayscale-0 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
