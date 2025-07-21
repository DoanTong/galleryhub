// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {
    // Định nghĩa role dưới dạng bytes32 constant
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");

    constructor(address superAdmin) {
        // Gán superAdmin làm người có quyền tối cao
        _grantRole(DEFAULT_ADMIN_ROLE, superAdmin);
        _grantRole(ADMIN_ROLE, superAdmin);
    }

    // Chỉ Admin mới có quyền thêm nghệ sĩ
    function addArtist(address account) external onlyRole(ADMIN_ROLE) {
        _grantRole(ARTIST_ROLE, account);
    }

    // Chỉ Admin mới có quyền xoá nghệ sĩ
    function removeArtist(address account) external onlyRole(ADMIN_ROLE) {
        _revokeRole(ARTIST_ROLE, account);
    }

    // Hàm public kiểm tra vai trò
    function isArtist(address account) external view returns (bool) {
        return hasRole(ARTIST_ROLE, account);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}
