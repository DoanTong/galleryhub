// server/controllers/user.controller.js
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as ethers from "ethers";
import crypto from "crypto";



// --- REGISTER ---
export const registerUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const newHashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      displayName,
      email,
      hashedPassword: newHashedPassword,
      walletAddress: null, // mặc định chưa gắn ví
      nonce: Math.floor(Math.random() * 1000000),
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { hashedPassword, ...detailsWithoutPassword } = user.toObject();
    res.status(201).json(detailsWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

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

    const { hashedPassword, ...detailsWithoutPassword } = user.toObject();
    res.status(200).json(detailsWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- LOGOUT ---
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

// --- GET USER ---
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

    const followerCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    const token = req.cookies.token;
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- FOLLOW / UNFOLLOW ---
export const followUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFollowing = await Follow.exists({ follower: req.userId, following: user._id });

    if (isFollowing) {
      await Follow.deleteOne({ follower: req.userId, following: user._id });
    } else {
      await Follow.create({ follower: req.userId, following: user._id });
    }

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- CONNECT WALLET ---
export const connectWallet = async (req, res) => {
  const userId = req.userId;
  const { address } = req.body;

  if (!address) return res.status(400).json({ message: "Address is required!" });

  try {
    const exist = await User.findOne({ walletAddress: address });
    if (exist) {
      return res.status(400).json({ message: "This wallet is already linked to another account" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { walletAddress: address },
      { new: true }
    );

    res.status(200).json({ message: "Kết nối ví thành công", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Bước 1: Gửi nonce để ký message
const walletNonces = {};

  // Bước 1: Request nonce
  export const requestWalletNonce = async (req, res) => {
    const userId = req.userId; // từ verifyToken
    const nonce = crypto.randomBytes(16).toString("hex");
    walletNonces[userId] = nonce;
    res.json({ nonce });
  };

// Bước 2: Verify wallet
export const verifyWallet = async (req, res) => {
  const userId = req.userId; // từ verifyToken
  const { address, signature } = req.body;

  const nonce = walletNonces[userId];
  if (!nonce) return res.status(400).json({ message: "Nonce not found" });

  // verify signature bằng ethers.js
  const signer = ethers.verifyMessage(`Sign this message to link wallet: ${nonce}`, signature);

  if (signer.toLowerCase() !== address.toLowerCase()) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  // Update user walletAddress
  await User.findByIdAndUpdate(userId, { walletAddress: address });
  
  // Xóa nonce sau khi dùng
  delete walletNonces[userId];

  res.json({ message: "Wallet verified successfully" });
};

