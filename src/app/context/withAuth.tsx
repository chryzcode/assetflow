"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Use "next/navigation" instead of "next/router"
import { useAuth } from "./AuthContext"; 

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const { state } = useAuth();
    const { isAuthenticated } = state;
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Prevents flicker before redirection
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
