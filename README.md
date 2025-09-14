📌 GalleryHub – Setup Guide
1. Yêu cầu môi trường

Node.js >= 18

erther 5.x.x

@openzeppelin/contracts 5.x.x

npm hoặc yarn

MongoDB (local hoặc Atlas)

MetaMask (kết nối blockchain testnet Sepolia)

Hardhat (triển khai smart contract)

2. Cấu hình file .env

   
🔹 Server (/server/.env)
PORT=5000

MONGO_URI=mongodb://localhost:27017/galleryhub

JWT_SECRET=your_jwt_secret

PINATA_JWT=your_jwt_pinata

IK_URL_ENDPOINT=https://ik.imagekit.io/rmq6ftld0

IK_PUBLIC_KEY=public_0E/9aJtIGCgs2RHqu3VqKrUHH1E=

IK_PRIVATE_KEY=private_Wid2Rp3fc5QOx1j+IofwxX9oXaA=

🔹 Client (/client/.env)

VITE_API_URL=http://localhost:5000

NFT_CONTRACT_ADDRESS=0xYourNFTContractAddress

VITE_GALLERYBUY_ADDRESS=0xYourBuyContractAddress

🔹 Contracts (/contracts/.env)

PRIVATE_KEY=your_wallet_private_key

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id

ETHERSCAN_API_KEY=your_etherscan_key


⚠️ Lưu ý: Không commit file .env lên GitHub.

3. Cài đặt thư viện

Cài đặt dependencies cho từng module:

# Cài thư viện cho client
cd client
npm install

# Cài thư viện cho server
cd ../server
npm install

# Cài thư viện cho contracts
cd ../contracts
npm install

4. Chạy dự án
🔹 4.1 Chạy Client (Vite)
cd client
npm run dev


👉 Mặc định chạy tại: http://localhost:5173

🔹 4.2 Chạy Server (Express + MongoDB)
cd server
npm run dev


👉 Server chạy tại: http://localhost:5000

🔹 4.3 Deploy Smart Contracts (Hardhat)
cd contracts

# Compile
npx hardhat compile

# Deploy contract lên Sepolia
npx hardhat run scripts/deploy.js --network sepolia


Sau khi deploy xong, update lại địa chỉ contract trong file .env của client:

VITE_GALLERYNFT_ADDRESS=0xNewDeployedNFTAddress
VITE_GALLERYBUY_ADDRESS=0xNewDeployedBuyAddress

5. Cấu trúc dự án
├── client       # Frontend React (Vite)
├── server       # Backend Express + MongoDB
└── contracts    # Smart Contracts (Hardhat)

6. Tài liệu tham khảo

Vite

React

Express.js

MongoDB

Hardhat

Ethers.js
