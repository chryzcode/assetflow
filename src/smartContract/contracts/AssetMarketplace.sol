// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AssetMarketplace {
    struct Asset {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string assetUrl;
        address payable owner;
        bool isSold;
    }

    uint256 private assetCounter;
    mapping(uint256 => Asset) public assets;

    event AssetListed(uint256 id, string name, uint256 price, address owner);
    event AssetPurchased(uint256 id, address buyer);

    // List a new asset
    function listAsset(string memory _name, string memory _description, uint256 _price, string memory _assetUrl) public {
        require(_price > 0, "Price must be greater than 0");

        assetCounter++;
        assets[assetCounter] = Asset(assetCounter, _name, _description, _price, _assetUrl, payable(msg.sender), false);

        emit AssetListed(assetCounter, _name, _price, msg.sender);
    }

    // Purchase an asset
    function purchaseAsset(uint256 _id) public payable {
        Asset storage asset = assets[_id];
        require(!asset.isSold, "Asset already sold");
        require(msg.value == asset.price, "Incorrect payment amount");

        asset.owner.transfer(msg.value);
        asset.isSold = true;

        emit AssetPurchased(_id, msg.sender);
    }

    // Get asset details
    function getAsset(uint256 _id) public view returns (Asset memory) {
        return assets[_id];
    }
}
