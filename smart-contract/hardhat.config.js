require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      accounts: ['0x91d2d2cbec31fa55d1a9cb767d566b4e08ce6234daf8fc2676c8483d1eedafdb']
    }
  }
};
