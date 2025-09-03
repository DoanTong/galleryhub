import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  followUser,
  connectWallet,
  requestWalletNonce,
  verifyWallet
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/wallet-nonce", verifyToken, requestWalletNonce);
router.post("/verify-wallet", verifyToken, verifyWallet);
router.post("/connect-wallet", verifyToken, connectWallet);

// Route động username cuối cùng
router.get("/:username", getUser);
router.post("/follow/:username", verifyToken, followUser);
export default router;
