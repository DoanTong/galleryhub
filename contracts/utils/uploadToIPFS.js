const { create } = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");

// Khởi tạo IPFS client – bạn có thể thay endpoint bằng Infura, Pinata, hoặc local
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

// Upload file lên IPFS (ảnh)
async function uploadFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const result = await client.add({ path: fileName, content: fileBuffer });
  return `https://ipfs.io/ipfs/${result.cid.toString()}`;
}

// Upload metadata JSON lên IPFS
async function uploadMetadataJSON(metadata) {
  const result = await client.add(JSON.stringify(metadata));
  return `https://ipfs.io/ipfs/${result.cid.toString()}`;
}

module.exports = {
  uploadFile,
  uploadMetadataJSON,
};
