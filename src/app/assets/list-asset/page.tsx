"use client";
import React, { useEffect } from "react";
import withAuth from "../../context/withAuth";
import AssetListingForm from "../../components/AssetListingForm";


const ListAssetPage = () => {
    
    return (
        <div>
            <AssetListingForm />
        </div>
    );

};

export default withAuth(ListAssetPage);