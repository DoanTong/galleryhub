import mongoose from 'mongoose';

const ArtworkSchema = new mongoose.Schema({
  title: String,
  tokenId: String,
  image: String,
  price: Number,
  isAuction: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model('Artwork', ArtworkSchema);