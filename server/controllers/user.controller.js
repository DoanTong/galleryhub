// server/controllers/user.controller.js
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { utils } from "ethers"; // <-- dùng utils.verifyMessage cho ethers v5
import crypto from "crypto";

// --- REGISTER ---
export const registerUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;
  console.log("registerUser called:", req.body);

  if (!username || !email || !password) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      displayName,
      email,
      hashedPassword,
      walletAddress: null,
      nonce: Math.floor(Math.random() * 1000000),
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { hashedPassword: _, ...detailsWithoutPassword } = user.toObject();
    console.log("User registered:", user.username);
    res.status(201).json(detailsWithoutPassword);
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("loginUser called:", req.body);

  if (!email || !password) return res.status(400).json({ message: "All fields are required!" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { hashedPassword: _, ...detailsWithoutPassword } = user.toObject();
    console.log("User logged in:", user.username);
    res.status(200).json(detailsWithoutPassword);
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGOUT ---
export const logoutUser = async (req, res) => {
  console.log("logoutUser called");
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

// --- GET USER ---
export const getUser = async (req, res) => {
  const { username } = req.params;
  console.log("getUser called:", username);

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { hashedPassword: _, ...detailsWithoutPassword } = user.toObject();
    const followerCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    const token = req.cookies?.token;
    if (!token) {
      return res.status(200).json({
        ...detailsWithoutPassword,
        followerCount,
        followingCount,
        isFollowing: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        console.log("Token invalid:", err);
        return res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: false,
        });
      }
      const isExists = await Follow.exists({ follower: payload.userId, following: user._id });
      res.status(200).json({
        ...detailsWithoutPassword,
        followerCount,
        followingCount,
        isFollowing: !!isExists,
      });
    });
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- FOLLOW / UNFOLLOW ---
export const followUser = async (req, res) => {
  const { username } = req.params;
  console.log("followUser called:", username, "by userId:", req.userId);

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFollowing = await Follow.exists({ follower: req.userId, following: user._id });
    if (isFollowing) {
      await Follow.deleteOne({ follower: req.userId, following: user._id });
      console.log("Unfollowed user:", username);
    } else {
      await Follow.create({ follower: req.userId, following: user._id });
      console.log("Followed user:", username);
    }

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error("followUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- CONNECT WALLET ---
export const connectWallet = async (req, res) => {
  const userId = req.userId;
  const { address } = req.body;
  console.log("connectWallet called for userId:", userId, "address:", address);

  if (!address) return res.status(400).json({ message: "Address is required!" });

  try {
    const exist = await User.findOne({ walletAddress: address });
    if (exist) return res.status(400).json({ message: "This wallet is already linked to another account" });

    const updatedUser = await User.findByIdAndUpdate(userId, { walletAddress: address }, { new: true });

    console.log("Wallet connected successfully for userId:", userId);
    res.status(200).json({ message: "Kết nối ví thành công", user: updatedUser });
  } catch (err) {
    console.error("connectWallet error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- WALLET NONCE STORAGE ---
const walletNonces = {};

// --- REQUEST NONCE ---
export const requestWalletNonce = async (req, res) => {
  const userId = req.userId;
  console.log("requestWalletNonce called for userId:", userId);

  const nonce = crypto.randomBytes(16).toString("hex");
  walletNonces[userId] = nonce;
  console.log("Nonce generated:", nonce);

  res.json({ nonce });
};

// --- VERIFY WALLET ---
export const verifyWallet = async (req, res) => {
  const userId = req.userId;
  const { address, signature } = req.body;

  console.log("verifyWallet called for userId:", userId);
  console.log("Request body:", req.body);

  try {
    const nonce = walletNonces[userId];
    if (!nonce) return res.status(400).json({ message: "Nonce not found" });

    let signer;
    try {
      signer = utils.verifyMessage(`Sign this message to link wallet: ${nonce}`, signature);
      console.log("Signer address:", signer);
    } catch (err) {
      console.log("Signature verification error:", err);
      return res.status(400).json({ message: "Invalid signature" });
    }

    if (signer.toLowerCase() !== address.toLowerCase()) {
      console.log("Signer mismatch. Address:", address, "Signer:", signer);
      return res.status(400).json({ message: "Signature does not match address" });
    }

    await User.findByIdAndUpdate(userId, { walletAddress: address });
    console.log("Wallet verified and updated for userId:", userId);

    delete walletNonces[userId];
    res.json({ message: "Wallet verified successfully" });
  } catch (err) {
    console.error("verifyWallet error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
