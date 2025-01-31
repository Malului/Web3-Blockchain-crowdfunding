const hre = require("hardhat");

const main = async () => {
    try {
        const contributions = await hre.ethers.getContractFactory("crowdFunding");

        console.log("Deploying contract...");
        const contributionsContract = await contributions.deploy();
        await contributionsContract.deploymentTransaction().wait();

        const contributionAddress = await contributionsContract.getAddress();
        console.log("Contarct deployed on address : ", contributionAddress);
    } catch (error) {
        console.log("Contarct deployment failed :", error);
    }
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();