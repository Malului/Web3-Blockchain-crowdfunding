import React, { useContext, createContext, useState } from "react";
import { assert, ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/contract';

const FundingContext = createContext();

//Create a contract instance
const fundingEthereumContract = async () => {
    try {

        if (!window.ethereum){
            alert("No ethereum wallet found");
            return null;
        }
             

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const fundingContract = new ethers.Contract(contractAddress, contractABI, signer);

        return fundingContract;
    } catch (error) {
        console.log("Error getting contract", error);
        throw error;
    }
};

export const FundingProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isTransactionPending, setIsTransactionPending] = useState(false);


    const connectWallet = async () => {
        try {
            if(!window.ethereum) return alert("Please install Metamask");

            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);


            console.log(accounts);
            return accounts[0];
            
        } catch (error) {
            console.log("Error connecting wallet:", error);
            throw error;
        }
    }

    const createCampaign = async (form) => {

        setIsTransactionPending(true);
        let campaignContract = null;

        try {
            campaignContract = await fundingEthereumContract();

            const deadline = Math.floor(new Date(form.deadline).getTime() / 1000); //Unix timestamp

                console.log("Creating a smart contract with the following details:", {
                    owner: currentAccount,
                    title: form.title,
                    description:form.description,
                    goal:form.goal,
                    deadline:deadline,
                    imageUrl:form.imageUrl
                }
            )

            const tx = await campaignContract.createCampaign(
                    currentAccount,  //owner
                    form.title,
                    form.description,
                    ethers.parseEther(form.goal.toString()),
                    form.deadline,
                    form.imageUrl,
            );

            console.log("Creating Campaign in process...")

            try {
                const receipt = await tx.wait();

                console.log("Contract created successfully", receipt);
                return receipt;
            } catch (error) {
                console.log("Contract creation failed:", error)
            }
        } catch (error) {
            console.log("Contract call failure", error);
            throw error;
        } finally {
            setIsTransactionPending(false);
            campaignContract = null;
        }
    }

    const getCampaigns = async () => {
        try {
            const contract = await fundingEthereumContract();

            try {
                const campaigns = await contract.getAllCampaigns();
                
                if(!campaigns || campaigns.length === 0) {
                    console.log("No Campaigns found");
                    return [];
                }
               
                const [
                    owners,
                    titles,
                    descriptions,
                    imageUrls,
                    goals,
                    deadlines,
                    amountsContributed,
                    claimeds,
                    endeds
                  ] = campaigns;
              
                  const parsedCampaigns = owners.map((_, i) => ({
                    owner: owners[i],
                    title: titles[i],
                    description: descriptions[i],
                    imageUrl: imageUrls[i],
                    goal: ethers.formatEther(goals[i].toString()),
                    deadline: deadlines[i].toString(),
                    amountContributed: ethers.formatEther(amountsContributed[i].toString()),
                    claimed: claimeds[i],
                    ended: endeds[i],
                    pId: i
                  }));
              
                  console.log(parsedCampaigns);
                  return parsedCampaigns;
            } catch (error) {
                console.log("Error calling campaigns", error);
                throw error;
            } 
        } catch (error) {
            console.log("Error setting up campaigns", error);
            throw error;
        }
        
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => {
            
            return campaign.owner.toLowerCase() === currentAccount.toLowerCase();
        });

            console.log(allCampaigns);
            console.log(filteredCampaigns);
            console.log(currentAccount);
        

            return filteredCampaigns;    
    }

    const donate = async (pId, amount) => {

        setIsTransactionPending(true);
        let fundContract = null;

        try {
            fundContract = await fundingEthereumContract();

            const tx = await fundContract.contributeToCampaign(pId, {value: ethers.parseEther(amount.toString())});

            console.log("Fund Transaction in process...");

            try {
                const transactionResult = await tx.wait();

                console.log("Fund Transaction successful", transactionResult);

                return transactionResult;
            } catch (error) {
                console.log("Fund transaction failed", error);
                throw error;
            }

        } catch (error) {
            console.log("Contract call failed", error);
            throw error;
        } finally {
            setIsTransactionPending(false);
            fundContract - null;
        }
    }

    const getDonations = async (pId) => {

        let donationsContract = null;

        try {
            donationsContract = await fundingEthereumContract();

            const [donators, amounts] = await contract.getDonatorDetails(pId);
            
            return donators.map((donator, i) => ({
                donator,
                donation: ethers.formatEther(amounts[i].toString())
            }));
        } catch (error) {
            console.log("Contract call failure", error)
            throw error;
        } finally {
            donationsContract = null;
        }
    }

    const claimFunds = async (pId) => {
        setIsTransactionPending(true);
        try {
            const contract = await fundingEthereumContract();
            const tx = await contract.claimFund(pId);
            await tx.wait();
            return tx;
        } catch (error) {
            console.error("Claiming funds failed:", error);
            throw error;
        } finally {
            setIsTransactionPending(false);
        }
    }

    const refundDonation = async (pId) => {
        setIsTransactionPending(true);
        try {
            const contract = await fundingEthereumContract();
            const tx = await contract.getRefund(pId);
            await tx.wait();
            return tx;
        } catch (error) {
            console.error("Refund failed:", error);
            throw error;
        } finally {
            setIsTransactionPending(false);
        }
    }

    return(
        <FundingContext.Provider
            value={{
                createCampaign,
                connectWallet,
                currentAccount,
                setCurrentAccount,
                getCampaigns,
                fundingEthereumContract,
                isTransactionPending,
                getUserCampaigns,
                donate,
                getDonations,
                claimFunds,
                refundDonation
            }}
        >
            {children}
        </FundingContext.Provider>
    )
}

export const useFundingContext = () => useContext(FundingContext);