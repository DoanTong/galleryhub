// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RoleManager.sol";

abstract contract ArtistRole {
    RoleManager public roleManager;

    constructor(address roleManagerAddress) {
        roleManager = RoleManager(roleManagerAddress);
    }

    modifier onlyArtist() {
        require(roleManager.isArtist(msg.sender), "ArtistRole: caller is not artist");
        _;
    }
}
