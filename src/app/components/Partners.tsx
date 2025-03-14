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
    <div className="flex flex-col justify-center items-center bg-blue-700 my-8 py-10">
      <p className="text-white text-4xl font-bold mb-16">ASSETFLOW PARTNERS</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 items-center">
        {partners.map((partner, index) => (
          <Image
            key={index}
            src={partner.src}
            alt={partner.name}
            width={120}
            height={60}
            className="object-contain grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
