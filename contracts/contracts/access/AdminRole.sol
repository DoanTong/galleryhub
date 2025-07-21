// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RoleManager.sol";

abstract contract AdminRole {
    RoleManager public roleManager;

    constructor(address roleManagerAddress) {
        roleManager = RoleManager(roleManagerAddress);
    }

    modifier onlyAdmin() {
        require(roleManager.isAdmin(msg.sender), "AdminRole: caller is not admin");
        _;
    }
}
