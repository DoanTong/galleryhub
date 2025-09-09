// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalleryBuy is Ownable {
    // nftContract => tokenId => price
    mapping(address => mapping(uint256 => uint256)) public prices;

    constructor() Ownable(msg.sender) {}

    // Owner (hoặc sau này là seller) set giá
    function setPrice(address nftContract, uint256 tokenId, uint256 priceWei) public {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        prices[nftContract][tokenId] = priceWei;

        // Approve contract này để có thể transfer
        nft.approve(address(this), tokenId);
    }

    // Buyer mua NFT
    function buyNFT(address nftContract, uint256 tokenId) public payable {
        IERC721 nft = IERC721(nftContract);
        address currentOwner = nft.ownerOf(tokenId);

        uint256 price = prices[nftContract][tokenId];
        require(price > 0, "NFT not for sale");
        require(msg.value >= price, "Insufficient ETH");
        require(currentOwner != msg.sender, "Already owner");

        // Chuyển NFT sang buyer
        nft.safeTransferFrom(currentOwner, msg.sender, tokenId);

        // Chuyển ETH cho seller
        payable(currentOwner).transfer(msg.value);

        // Reset giá để tránh bị mua lại nhiều lần
        prices[nftContract][tokenId] = 0;
    }
}
