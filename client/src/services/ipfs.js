import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: import.meta.env.VITE_WEB3STORAGE_TOKEN });

export const uploadToIPFS = async (file, metadata) => {
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const files = [file, new File([blob], 'metadata.json')];
  const cid = await client.put(files);
  return `https://${cid}.ipfs.dweb.link/metadata.json`;
};