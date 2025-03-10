export const  maskWalletAddress = (wallet: string) => {
    if (!wallet || wallet.length < 8) return wallet;
    return `${wallet.slice(0, 5)}*********${wallet.slice(-5)}`;
  };