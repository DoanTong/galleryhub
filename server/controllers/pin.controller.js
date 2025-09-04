import Pin from "../models/pin.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import Board from "../models/board.model.js";
import sharp from "sharp";
import Imagekit from "imagekit";
import jwt from "jsonwebtoken";

/**
 * GET /pins
 */
export const getPins = async (req, res) => {
  try {
    const pageNumber = Number(req.query.cursor) || 0;
    const search = req.query.search;
    const userId = req.query.userId;
    const boardId = req.query.boardId;
    const LIMIT = 21;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { tags: { $in: [search] } },
          ],
        }
      : userId
      ? { user: userId }
      : boardId
      ? { board: boardId }
      : {};

    const pins = await Pin.find(filter)
      .limit(LIMIT)
      .skip(pageNumber * LIMIT)
      .populate("user", "_id username displayName walletAddress");

    const hasNextPage = pins.length === LIMIT;

    res.status(200).json({
      pins,
      nextCursor: hasNextPage ? pageNumber + 1 : null,
    });
  } catch (err) {
    console.error("getPins error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /pins/:id
 */
export const getPin = async (req, res) => {
  try {
    const { id } = req.params;
    const pin = await Pin.findById(id).populate(
      "user",
      "username img displayName walletAddress"
    );

    if (!pin) return res.status(404).json({ message: "Pin not found" });

    res.status(200).json(pin);
  } catch (err) {
    console.error("getPin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /pins
 */
export const createPin = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      board,
      tags,
      textOptions,
      canvasOptions,
      newBoard,
    } = req.body;

    const media = req.files?.media;
    if (!title || !description || !media) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // upload image bằng ImageKit
    const imagekit = new Imagekit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    const uploadRes = await imagekit.upload({
      file: media.data,
      fileName: media.name,
      folder: "test",
    });

    // nếu user tạo board mới
    let newBoardId;
    if (newBoard) {
      const createdBoard = await Board.create({
        title: newBoard,
        user: req.userId,
      });
      newBoardId = createdBoard._id;
    }

    const newPin = await Pin.create({
      user: req.userId,
      title,
      description,
      link: link || null,
      board: newBoardId || board || null,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      media: uploadRes.filePath,
      width: uploadRes.width,
      height: uploadRes.height,
    });

    res.status(201).json(newPin);
  } catch (err) {
    console.error("createPin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /pins/:id
 */
export const deletePin = async (req, res) => {
  try {
    const { id } = req.params;

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    // chỉ cho phép owner xóa
    if (pin.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Like.deleteMany({ pin: id });
    await Save.deleteMany({ pin: id });
    await Pin.findByIdAndDelete(id);

    res.status(200).json({ message: "Pin deleted successfully" });
  } catch (err) {
    console.error("deletePin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /pins/interaction-check/:id
 */
export const interactionCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.token;

    const likeCount = await Like.countDocuments({ pin: id });

    if (!token) {
      return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res
          .status(200)
          .json({ likeCount, isLiked: false, isSaved: false });
      }

      const userId = payload.userId;

      const isLiked = await Like.findOne({ user: userId, pin: id });
      const isSaved = await Save.findOne({ user: userId, pin: id });

      res.status(200).json({
        likeCount,
        isLiked: !!isLiked,
        isSaved: !!isSaved,
      });
    });
  } catch (err) {
    console.error("interactionCheck error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /pins/interact/:id
 */
export const interact = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (type === "like") {
      const isLiked = await Like.findOne({ pin: id, user: req.userId });

      if (isLiked) {
        await Like.deleteOne({ pin: id, user: req.userId });
      } else {
        await Like.create({ pin: id, user: req.userId });
      }
    } else if (type === "save") {
      const isSaved = await Save.findOne({ pin: id, user: req.userId });

      if (isSaved) {
        await Save.deleteOne({ pin: id, user: req.userId });
      } else {
        await Save.create({ pin: id, user: req.userId });
      }
    }

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error("interact error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updatePin = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    if (String(pin.user) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    pin.title = title || pin.title;
    pin.description = description || pin.description;
    await pin.save();

    return res.status(200).json(pin);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
};