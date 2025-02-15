import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";

const poppins = Poppins({
  weight: ["400"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssetFlow",
  description: "AssetFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add Google Material Icons stylesheet */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <Navbar />
        {children}
        <ToastContainer   />
      </body>
    </html>
  );
}
