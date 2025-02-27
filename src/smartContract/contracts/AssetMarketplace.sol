// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AssetMarketplace {
    struct Asset {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string assetUrl;
        string userId; // Unique user ID instead of wallet address
        address payable currentWallet; // Tracks the latest wallet that purchased
        bool isSold;
    }

    uint256 private assetCounter;
    mapping(uint256 => Asset) public assets;
    mapping(string => uint256[]) private userAssets; // Map userId to asset IDs

    event AssetListed(uint256 id, string name, uint256 price, string userId);
    event AssetPurchased(uint256 id, string userId, address wallet);

    // List a new asset under a user ID
    function listAsset(
        string memory _userId,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _assetUrl
    ) public {
        require(_price > 0, "Price must be greater than 0");

        assetCounter++;
        assets[assetCounter] = Asset(
            assetCounter,
            _name,
            _description,
            _price,
            _assetUrl,
            _userId,
            payable(address(0)), // No wallet associated yet
            false
        );

        userAssets[_userId].push(assetCounter);

        emit AssetListed(assetCounter, _name, _price, _userId);
    }

    // Purchase an asset
    function purchaseAsset(uint256 _id, string memory _userId) public payable {
        Asset storage asset = assets[_id];
        require(!asset.isSold, "Asset already sold");
        require(msg.value == asset.price, "Incorrect payment amount");

        asset.currentWallet.transfer(msg.value);
        asset.currentWallet = payable(msg.sender); // Update to the buyer's wallet
        asset.isSold = true;

        // Update ownership mapping
        userAssets[_userId].push(_id);

        emit AssetPurchased(_id, _userId, msg.sender);
    }

    // Get all assets for a user by userId
    function getUserAssets(string memory _userId) public view returns (Asset[] memory) {
        uint256[] storage assetIds = userAssets[_userId];
        Asset[] memory userOwnedAssets = new Asset[](assetIds.length);

        for (uint256 i = 0; i < assetIds.length; i++) {
            userOwnedAssets[i] = assets[assetIds[i]];
        }

        return userOwnedAssets;
    }
}
