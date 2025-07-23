// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalleryToken is ERC20, Ownable {
    // Mapping lưu số token đã tip cho mỗi NFT
    mapping(uint256 => uint256) private _tips;

    // Địa chỉ hợp đồng NFT được phép nhận tip
    address public nftContract;

    // Sự kiện khi tip được gửi
    event Tipped(uint256 indexed tokenId, address indexed from, uint256 amount);

    constructor(uint256 initialSupply) ERC20("GalleryToken", "GTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    // Chỉ chủ sở hữu được phép set địa chỉ NFT
    function setNFTContract(address _nftContract) external onlyOwner {
        nftContract = _nftContract;
    }

    // Gửi tip bằng token đến 1 NFT
    function tipNFT(uint256 tokenId, uint256 amount) public {
        require(nftContract != address(0), "NFT contract not set");
        require(amount > 0, "Amount must be > 0");

        // Chuyển token từ người gửi đến contract này
        _transfer(msg.sender, address(this), amount);

        // Cộng dồn vào tips
        _tips[tokenId] += amount;

        emit Tipped(tokenId, msg.sender, amount);
    }

    // Lấy tổng số token đã tip cho NFT
    function getTotalTips(uint256 tokenId) public view returns (uint256) {
        return _tips[tokenId];
    }
}
