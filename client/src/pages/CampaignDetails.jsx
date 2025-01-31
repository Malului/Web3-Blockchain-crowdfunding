import React, { useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

import { CountBox, CustomButton, Loader } from '../components'
import { thirdweb } from '../assets'
import { calculateBarPercentage, daysLeft } from '../utils'
import { useFundingContext } from '../context'

const CampaignDetails = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { 
    getDonations, 
    currentAccount, 
    isTransactionPending, 
    donate, 
    connectWallet,
    claimFunds,
    refundDonation
  } = useFundingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [userContribution, setUserContribution] = useState(0);
  
  const contractDeadline = state.deadline * 1000;
  const remainingDays = daysLeft(contractDeadline);

  const canClaim = (
    currentAccount?.toLowerCase() === state.owner?.toLowerCase() &&
    !state.claimed &&
    remainingDays <= 0 &&
    parseFloat(state.amountContributed) >= parseFloat(state.goal)
  );

  const canRefund = (
    currentAccount &&
    remainingDays <= 0 &&
    parseFloat(state.amountContributed) < parseFloat(state.goal) &&
    userContribution > 0 &&
    !state.claimed
  );

  const fetchDonators = async () => {
    setIsLoading(true);

    try {
      const data = await getDonations(state.pId);

      setDonators(data);

      const contribution = data.find(d => 
        d.donator.toLowerCase() === currentAccount?.toLowerCase()
      )?.donation || 0;
      setUserContribution(parseFloat(contribution));
    } catch (error) {
      console.log("Fetch Donators failed", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentAccount) fetchDonators();
  }, [currentAccount])

  const handleDonate = async () => {
    setIsLoading(true);
    try {

      const result = await donate(state.pId, amount);

      if(!isTransactionPending) {
        console.log("Fund send successfully", result);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      await claimFunds(state.pId);
      navigate('/');
    } catch (error) {
      console.log("Claim failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      await refundDonation(state.pId);
      await fetchDonators();
      navigate('/');
    } catch (error) {
      console.log("Refund failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader 
                      showMessage = {true}
                    />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">

        <div className="flex-1 flex-col">
          <img 
              src={state.imageUrl} 
              alt="campaign" 
              className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full mt-2">
            <div className="w-full h-[5px] bg-[#3a3a43]">
              <div 
                className="absolute h-full bg-[#4acd8d]"
                style={{ 
                  width: `${calculateBarPercentage(state.goal, state.amountContributed)}%`, 
                  maxWidth: '100%', 
                  height: '0.4rem'
                }}
              />
            </div>
      
            <div className="mt-4 text-center">
              <p className="font-epilogue text-white text-sm sm:text-base md:text-lg font-semibold break-words">
                Donors have raised {calculateBarPercentage(state.goal, state.amountContributed.toString())}% of the target
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox 
              title="Days Left" 
              value={remainingDays} 
          />
          <CountBox 
              title={`Raised of ${state.goal} ETH`}
              value={state.amountContributed}
          />
          <CountBox 
              title="Total Backers" 
              value={donators.length} 
          />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">

                <img 
                    src={thirdweb} 
                    alt="user" 
                    className="w-[60%] h-[60%] object-contain"
                />

              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>

                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {state.claimed ? 'Funds claimed' : 'Active campaign'}
                </p>
              </div>

              {canClaim && (
                 <CustomButton
                 btnType="button"
                 title={isTransactionPending ? "Claiming..." : "Claim Funds"}
                 styles="ml-4 bg-[#4acd8d]"
                 handleClick={handleClaim}
               />
             )}

            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  {state.description}
                </p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Donators
            </h4>

              <div className="mt-[20px] flex flex-col gap-4">

                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">

                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.donator}

                      {item.donator.toLowerCase() === currentAccount?.toLowerCase() && (
                      <span className="ml-2 text-[#4acd8d]">(You)</span>
                    )}
                    </p>

                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item.donation}
                    </p>

                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    No donators yet. Be the first one!
                   </p>

                )}
              </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">

            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>

            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">

                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>

                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to you.
                </p>

              </div>

              {canRefund ? (
                <div className="mt-6 border-t border-[#3a3a43] pt-6">
                  <h4 className="font-epilogue font-semibold text-[16px] text-white mb-4">
                    Your Contribution: {userContribution} ETH
                  </h4>
                  <CustomButton 
                    btnType="button"
                    title={isTransactionPending ? "Processing..." : "Request Refund"}
                    styles="w-full bg-[#f84550] hover:bg-[#d93a45]"
                    handleClick={handleRefund}
                  />
                  <p className="mt-2 text-[#808191] text-sm">
                    You can refund your contribution as the campaign didn't reach its goal
                  </p>
                </div>
              ) : (
                <CustomButton 
                  btnType="button"
                  title={currentAccount ? "Fund Campaign" : "Connect Wallet"}
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={currentAccount ? handleDonate : connectWallet}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails