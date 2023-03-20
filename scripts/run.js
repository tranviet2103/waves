const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),});
  await waveContract.deployed();
  console.log("Contract address:", waveContract.address);


    /*
   * Get Contract balance
   */
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );


  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave("Hello!!!!!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:", hre.ethers.utils.formatEther(contractBalance)
  );

  let waveTxn2 = await waveContract.wave("Heluuuuuuu!!!!!");
  await waveTxn2.wait(); // Wait for the transaction to be mined

    /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:", hre.ethers.utils.formatEther(contractBalance)
  );

//This code retrieves all the waves stored on the WavePortal smart contract using the getAllWaves() function, which returns an array of Wave structs. The retrieved waves are then stored in the allWaves variable. The console.log(allWaves) statement then logs the allWaves variable to the console. This allows us to see the waves retrieved from the smart contract in a human-readable format.
  let allWaves = await waveContract.getAllWaves();
  console.log("All the waves stored on the WavePortal smart contract as below:");
  console.log("---------------------------------------------------------------");
  console.log(allWaves);
  console.log("---------------------------------------------------------------");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();