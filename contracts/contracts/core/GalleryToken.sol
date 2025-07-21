// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalleryToken is ERC20, Ownable {
    // Constructor nhận supply ban đầu và cấp quyền sở hữu cho msg.sender
    constructor(uint256 initialSupply) ERC20("GalleryToken", "GTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply); // Cấp phát token cho chủ sở hữu
    }
}
