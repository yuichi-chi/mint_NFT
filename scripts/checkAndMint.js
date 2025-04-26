const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Account:", signer.address);

  const contractAddress = "0xA0d18EcF7542cD8032431b2cc56402408A210bdE";
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(contractAddress);

  // コントラクトの状態を確認
  console.log("\nChecking contract state...");
  const name = await nft.name();
  const symbol = await nft.symbol();
  const totalSupply = await nft.totalSupply();
  const mintPrice = await nft.MINT_PRICE();
  const maxSupply = await nft.MAX_SUPPLY();
  const balance = await nft.balanceOf(signer.address);

  console.log(`Contract Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${totalSupply}`);
  console.log(`Mint Price: ${ethers.formatEther(mintPrice)} ETH`);
  console.log(`Max Supply: ${maxSupply}`);
  console.log(`Your NFT Balance: ${balance}`);

  // ミント可能か確認
  if (balance > 0) {
    console.log("\nYou already have an NFT. Cannot mint more due to 1 NFT per address limit.");
    return;
  }

  if (totalSupply >= maxSupply) {
    console.log("\nMax supply reached. Cannot mint more NFTs.");
    return;
  }

  // ミントを実行
  console.log("\nMinting NFT...");
  try {
    const tx = await nft.mint({ value: mintPrice });
    console.log("Transaction hash:", tx.hash);
    console.log("\nTransaction pending...");
    
    // Pending状態の表示
    let dots = "";
    const pendingInterval = setInterval(() => {
      process.stdout.write(`\rWaiting for confirmation${dots}`);
      dots = dots.length >= 3 ? "" : dots + ".";
    }, 1000);

    const receipt = await tx.wait();
    clearInterval(pendingInterval);
    console.log("\nTransaction confirmed in block:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // ミント後の残高を確認
    const newBalance = await nft.balanceOf(signer.address);
    console.log("Your new NFT balance:", newBalance.toString());

    // トランザクションの確認リンクを表示
    console.log("\nView transaction on Etherscan:");
    console.log(`https://sepolia.etherscan.io/tx/${tx.hash}`);
  } catch (error) {
    console.error("\nError during minting:");
    if (error.message.includes("You can only mint one NFT per address")) {
      console.error("You have already minted an NFT.");
    } else if (error.message.includes("insufficient funds")) {
      console.error("Insufficient funds for minting.");
    } else {
      console.error(error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 