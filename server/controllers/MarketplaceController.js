// Import thư viện ethers để giao tiếp với blockchain
import { ethers } from "ethers";


// Import model Mongoose để thao tác dữ liệu Artwork trong MongoDB
import Artwork from "../models/Artwork.js";

// Nạp biến môi trường từ file .env
import dotenv from "dotenv";
dotenv.config();

// Tạo provider để kết nối blockchain thông qua RPC URL
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Tạo ví (wallet) từ PRIVATE_KEY để ký giao dịch
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Import ABI của hợp đồng NFT
import GalleryNFTABI from "../../contracts/artifacts/contracts/GalleryNFT.sol/GalleryNFT.json" assert { type: "json" };

// Tạo instance của contract để gọi các hàm trên smart contract
const nftContract = new ethers.Contract(
    process.env.NFT_CONTRACT_ADDRESS,
    GalleryNFTABI.abi,
    wallet
);

/**
 * API đăng bán tranh
 * Ghi trạng thái "forSale" và "price" vào MongoDB
 */
export async function listForSale(req, res) {
    try {
        const { tokenId, price } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!tokenId || !price) {
            return res.status(400).json({ error: "Missing tokenId or price." });
        }

        // Cập nhật trạng thái tác phẩm trong MongoDB
        await Artwork.findOneAndUpdate(
            { tokenId },
            { forSale: true, price },
            { new: true, upsert: true }
        );

        return res.json({ message: "Artwork listed for sale.", tokenId, price });
    } catch (error) {
        console.error("Error listing artwork:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

/**
 * API mua tranh NFT
 * Gửi giao dịch chuyển NFT trên blockchain
 * Cập nhật lại chủ sở hữu trong MongoDB
 */
export async function buyArtwork(req, res) {
    try {
        const { tokenId } = req.body;
        const buyerAddress = req.user.walletAddress; // Địa chỉ ví của người mua

        if (!tokenId || !buyerAddress) {
            return res.status(400).json({ error: "Missing tokenId or buyer address." });
        }

        // Lấy thông tin tác phẩm từ DB
        const artwork = await Artwork.findOne({ tokenId });
        if (!artwork || !artwork.forSale) {
            return res.status(404).json({ error: "Artwork not found or not for sale." });
        }

        // Gửi giao dịch blockchain để chuyển NFT từ người bán sang người mua
        const tx = await nftContract["safeTransferFrom"](
            artwork.ownerAddress,
            buyerAddress,
            tokenId
        );
        await tx.wait(); // Chờ giao dịch xác nhận

        // Cập nhật dữ liệu trong MongoDB
        artwork.ownerAddress = buyerAddress;
        artwork.forSale = false;
        artwork.price = 0;
        await artwork.save();

        return res.json({ message: "Artwork purchased successfully.", txHash: tx.hash });
    } catch (error) {
        console.error("Error buying artwork:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

/**
 * API bắt đầu đấu giá
 * Ghi thông tin đấu giá vào MongoDB
 */
export async function startAuction(req, res) {
    try {
        const { tokenId, startingBid, endTime } = req.body;

        if (!tokenId || !startingBid || !endTime) {
            return res.status(400).json({ error: "Missing parameters." });
        }

        // Cập nhật trạng thái đấu giá
        await Artwork.findOneAndUpdate(
            { tokenId },
            {
                auction: {
                    active: true,
                    startingBid,
                    highestBid: startingBid,
                    highestBidder: null,
                    endTime,
                },
                forSale: false,
            },
            { new: true, upsert: true }
        );

        return res.json({ message: "Auction started.", tokenId });
    } catch (error) {
        console.error("Error starting auction:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

/**
 * API đặt giá đấu
 * Cập nhật giá đấu cao nhất trong MongoDB
 */
export async function placeBid(req, res) {
    try {
        const { tokenId, bidAmount } = req.body;
        const bidder = req.user.walletAddress;

        if (!tokenId || !bidAmount || !bidder) {
            return res.status(400).json({ error: "Missing parameters." });
        }

        const artwork = await Artwork.findOne({ tokenId });
        if (!artwork || !artwork.auction || !artwork.auction.active) {
            return res.status(404).json({ error: "Auction not found." });
        }

        if (bidAmount <= artwork.auction.highestBid) {
            return res.status(400).json({ error: "Bid must be higher than current highest bid." });
        }

        // Ghi nhận giá đấu mới
        artwork.auction.highestBid = bidAmount;
        artwork.auction.highestBidder = bidder;
        await artwork.save();

        return res.json({ message: "Bid placed successfully.", tokenId, bidAmount });
    } catch (error) {
        console.error("Error placing bid:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

/**
 * API kết thúc đấu giá
 * Chuyển NFT cho người thắng (nếu có) và cập nhật MongoDB
 */
export async function endAuction(req, res) {
    try {
        const { tokenId } = req.body;

        const artwork = await Artwork.findOne({ tokenId });
        if (!artwork || !artwork.auction || !artwork.auction.active) {
            return res.status(404).json({ error: "Auction not found." });
        }

        if (Date.now() < artwork.auction.endTime) {
            return res.status(400).json({ error: "Auction has not ended yet." });
        }

        const winner = artwork.auction.highestBidder;
        if (!winner) {
            // Nếu không ai đặt giá, kết thúc đấu giá
            artwork.auction.active = false;
            await artwork.save();
            return res.json({ message: "Auction ended with no bids." });
        }

        // Chuyển NFT cho người thắng
        const tx = await nftContract["safeTransferFrom"](
            artwork.ownerAddress,
            winner,
            tokenId
        );
        await tx.wait();

        // Cập nhật dữ liệu
        artwork.ownerAddress = winner;
        artwork.auction.active = false;
        await artwork.save();

        return res.json({ message: "Auction completed.", winner, txHash: tx.hash });
    } catch (error) {
        console.error("Error ending auction:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
