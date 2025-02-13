import Image from "next/image";
//let all the image have same height and width  
const services = [
  {
    title: "Blockchain-Powered Asset Management",
    description:
      "With Asset Flow, every transaction and asset transfer is recorded on the blockchain, ensuring secure ownership, traceability, and transparency. No more worrying about lost or altered records – blockchain keeps your assets safe and verifiable.",
    features: [
      "Secure and Immutable Ownership",
      "Tamper-Proof Audit Trail",
      "Ownership Transfer with Blockchain Verification",
    ],
    image: "/assets/undraw_bitcoin.svg", // Replace with actual image
  },
  {
    title: "Real-Time Asset Data Syncing",
    description:
      "Asset Flow ensures that all your asset information stays in sync, no matter where you are. With real-time updates, you can monitor asset status, transfers, and changes as they happen.",
    features: [
      "Instant Notifications on Asset Updates",
      "Metadata Sync Across All Devices",
      "Live Tracking of Asset Transactions",
    ],
    image: "/assets/undraw_ether.svg",
  },
  {
    title: "Seamless Asset Tracking & Management",
    description:
      "Whether you’re managing physical assets like machinery, vehicles, or digital collectibles like NFTs, Asset Flow provides an intuitive platform for asset tracking, transfer, and management.",
    features: [
      "Asset Creation with Unique Identifiers",
      "Ownership Transfer with Security Control",
      "Comprehensive Audit Trail for Verification",
    ],
    image: "/assets/undraw_nakamoto.svg",
  },
  {
    title: "A Transparent and Secure Experience",
    description:
      "With Asset Flow, you have full visibility into every step of the asset lifecycle. From creation to transfer, every action is transparent, so you can be sure of the integrity and security of your assets.",
    features: [
      "Blockchain-Powered Transparency",
      "Smart Contracts for Secure Ownership",
      "Full History of Asset Transactions",
    ],
    image: "/assets/undraw_crypto.svg",
  },
];

const ServicesSection = () => {
  return (
    <section className="container mx-auto px-6 py-5">
      <h1 className="text-5xl font-bold text-center mb-16 text-blue-500">Our Services</h1>

      <div className="flex flex-col gap-20">
        {services.map((service, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-10`}
          >
            {/* Image Section */}
            <div className="md:w-1/2 py-10 ">
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={400}
                className="rounded-xl shadow-lg"
                //animate bounce
                style={{ animation: 'bounce 2s infinite' }}
              />
            </div>

            {/* Text Content */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-blue-300">{service.title}</h2>
              <p className="text-gray-300 text-lg mb-6">{service.description}</p>

              <ul className="list-disc list-inside text-gray-300 text-lg">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="mb-2">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
