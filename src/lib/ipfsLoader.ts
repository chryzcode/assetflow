const ipfsLoader = ({ src }: { src: string }) => {
  if (src.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${src.slice(7)}`;
  }
  return src;
};

export default ipfsLoader;
