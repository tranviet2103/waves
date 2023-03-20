require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.17",
    networks: {
      goerli: {
        //url: "https://quick-dark-daylight.ethereum-goerli.discover.quiknode.pro/2c1fb5bee1912bf7dde73d2fff67e0bdaeafdbf6/",
        url: process.env.STAGING_QUICKNODE_KEY,
        //accounts: ["aaef460e1610a978e93982535bed51fe35defad049f2ad49573fa851327ae153"]
        accounts: [process.env.PRIVATE_KEY],
      },
    },

};