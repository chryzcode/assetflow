import Image from "next/image";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
export default function Home() {
  return (
    <>
      <Navbar />

      <header className="text-center py-20">
        <div className="relative w-full h-full flex items-center justify-center mx-auto container">
          <h1
            className="text-6xl font-bold uppercase tracking-wide text-transparent bg-clip-text"
            style={{
              backgroundImage: "url('/assets/text-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Empowering Seamless Asset Management and Solutions
          </h1>
        </div>

        <div className="m-16 flex flex-col md:flex-row items-center md:justify-between max-w-6xl mx-auto container">
          <p className="text-gray-300 text-lg w-full md:w-1/2 text-center md:text-left">
            We innovate and decentralize. AssetFlow uses blockchain to transform
            asset management with secure, transparent, and efficient solutions,
            streamlining processes and unlocking new growth opportunities for
            businesses in the digital age.
          </p>

          <button className="mt-6 md:mt-0 bg-blue-500 px-8 py-4 text-white font-bold flex items-center">
            Let's Talk{" "}
            <span className="material-icons animate-arrow">arrow_forward</span>
          </button>
        </div>

        <div className="flex justify-center items-center flex-col mt-24">
          <p className="text-gray-300 text-sm my-4">Scroll</p>
          <span className="material-icons animate-bounce">arrow_downward</span>
        </div>

        <div className="flex justify-center items-center bg-blue-500 my-8 py-10">
          <p className="text-white text-4xl font-bold">ASSETFLOW</p>
        </div>
      </header>

      <Services />

      <div className="flex flex-col items-center justify-center mx-auto text-center my-20 container">
        <h1 className="text-4xl font-bold">Start Managing Your Assets Today</h1>
        <p className="text-gray-300 text-xl py-5">
          Ready to take control of your assets with security and transparency?
          Get started with Asset Flow today and revolutionize how you manage,
          track, and transfer your assets.
        </p>

        <div className="my-10">
          <button className="mt-6 md:mt-0 bg-blue-500 px-8 py-4 text-white font-bold flex items-center ">
            Get Started
            <span className="material-icons animate-arrow">arrow_forward</span>
          </button>
        </div>
      </div>
    </>
  );
}
