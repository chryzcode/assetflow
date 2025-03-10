// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AssetMarketplace is Initializable {
    struct Asset {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string assetUrl;
        string userId;
        address payable currentWallet;
        bool isSold;
        address creator;
    }

    uint256 private assetCounter;
    mapping(uint256 => Asset) public assets;
    mapping(string => uint256[]) private userAssets;
    mapping(address => uint256) public creatorEarnings;

    event AssetListed(uint256 id, string name, uint256 price, string userId);
    event AssetPurchased(uint256 id, string userId, address wallet, uint256 price);
    event CreatorEarnings(address indexed creator, uint256 amount);

    function initialize() public initializer {
        assetCounter = 0; // Initialize asset counter
    }

    function listAsset(
        string memory _userId,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _assetUrl
    ) public {
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_assetUrl).length > 0, "Asset URL cannot be empty");

        assetCounter++;
        assets[assetCounter] = Asset(
            assetCounter,
            _name,
            _description,
            _price,
            _assetUrl,
            _userId,
            payable(msg.sender),
            false,
            msg.sender
        );
        userAssets[_userId].push(assetCounter);
        emit AssetListed(assetCounter, _name, _price, _userId);
    }

    function purchaseAsset(uint256 _id, string memory _userId) public payable {
        Asset storage asset = assets[_id];
        require(!asset.isSold, "Asset already sold");
        require(msg.value == asset.price, "Incorrect payment amount");
        require(bytes(_userId).length > 0, "User ID cannot be empty");

        // Transfer funds to creator
        (bool success, ) = asset.creator.call{value: msg.value}("");
        require(success, "Transfer failed");

        creatorEarnings[asset.creator] += msg.value;
        emit CreatorEarnings(asset.creator, msg.value);

        // Update asset ownership
        asset.currentWallet = payable(msg.sender);
        asset.isSold = true;
        userAssets[_userId].push(_id);

        emit AssetPurchased(_id, _userId, msg.sender, asset.price);
    }

    function getAssetCounter() public view returns (uint256) {
        return assetCounter;
    }

    function getUserAssets(string memory _userId) public view returns (Asset[] memory) {
        uint256[] storage assetIds = userAssets[_userId];
        Asset[] memory userOwnedAssets = new Asset[](assetIds.length);
        for (uint256 i = 0; i < assetIds.length; i++) {
            userOwnedAssets[i] = assets[assetIds[i]];
        }
        return userOwnedAssets;
    }

    function getCreatorEarnings() public view returns (uint256) {
        return creatorEarnings[msg.sender];
    }
}
