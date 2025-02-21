"use client";
import React, { useEffect } from "react";
import withAuth from "../../context/withAuth";
import AssetListingForm from "../../components/AssetListingForm";
import {getAuthUser} from "@/lib/useAuthUser";


const ListAssetPage = () => {
    const user = getAuthUser();
    
    return (
        <div>
            <AssetListingForm />
        </div>
    );

};

export default withAuth(ListAssetPage);