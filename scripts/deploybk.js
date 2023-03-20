const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address, "(contract's address)");
    console.log("Contract deployed by:", owner.address, "(owner/deployer's address)");
    console.log("Account balance: ", accountBalance.toString());

//  console.log("Deploying contracts with account: ", deployer.address);


    await waveContract.getTotalWaves();

    const firstWaveTxn = await waveContract.wave();
    await firstWaveTxn.wait();

    const secondWaveTxn = await waveContract.wave();
    await secondWaveTxn.wait();

    const thirdWaveTxn = await waveContract.wave();
    await thirdWaveTxn.wait();

    const fourthWaveTxn = await waveContract.wave();
    await fourthWaveTxn.wait();

    await waveContract.getTotalWaves();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();