// Tạo metadata chuẩn ERC-721 cho NFT
function createMetadata({ name, description, image }) {
  return {
    name,
    description,
    image, // URL IPFS hình ảnh đã upload
    attributes: [
      {
        trait_type: "Creator",
        value: "GalleryHub Artist"
      },
      {
        trait_type: "Minted At",
        value: new Date().toISOString()
      }
    ]
  };
}

module.exports = {
  createMetadata,
};
