import fs from 'fs';

export function createMetadata({ name, description, image }) {
  return {
    name,
    description,
    image,
  };
}

export function saveMetadataToFile(metadata, path = './metadata.json') {
  fs.writeFileSync(path, JSON.stringify(metadata, null, 2));
  console.log('Saved metadata to', path);
}
