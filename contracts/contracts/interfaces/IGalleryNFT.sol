// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IGalleryNFT {
    /// @notice Trả về URI metadata của một NFT cụ thể
    function tokenURI(uint256 tokenId) external view returns (string memory);

    /// @notice Mint NFT cho một người dùng cụ thể
    function mint(address to, string memory tokenURI) external returns (uint256);

    /// @notice Trả về chủ sở hữu của token
    function ownerOf(uint256 tokenId) external view returns (address);

    /// @notice Kiểm tra nếu một địa chỉ sở hữu token
    function balanceOf(address owner) external view returns (uint256);

    /// @notice Chuyển NFT từ người gửi đến người nhận
    function transferFrom(address from, address to, uint256 tokenId) external;

    /// @notice Kiểm tra ai được phép quản lý token
    function getApproved(uint256 tokenId) external view returns (address);

    /// @notice Xác nhận một địa chỉ có phải được quyền điều khiển token hay không
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}
