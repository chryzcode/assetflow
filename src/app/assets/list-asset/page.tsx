"use client";
import React, { useEffect } from "react";
import withAuth from "../../context/withAuth";
import AssetListingForm from "../../components/AssetListingForm";
import { useGetAuthUser } from "@/lib/useGetAuthUser";


const ListAssetPage = () => {
    const user =  useGetAuthUser();
    
    return (
        <div>
            <AssetListingForm user={user} />
        </div>
    );

};

export default withAuth(ListAssetPage);