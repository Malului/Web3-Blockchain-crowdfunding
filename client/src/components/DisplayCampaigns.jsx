import React from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";

import { FundCard, Loader } from '../components'

const DisplayCampaigns = ({title, isLoading, campaigns}) => {
    const navigate = useNavigate();

    const handleNavigate = (campaign) => {
        navigate(`/campaign-details/${campaign.title}`, { state: campaign})
    }

  return (
    <div>
        <h1 className='font-epilogue font-semibold text-white text-left'>
            {title} ({campaigns.length})
        </h1>

        <div className='flex flex-wrap mt-[20px] gap-[26px]'>
              {isLoading && (
                      <Loader
                          showMessage={true}
                          customMessage= "Loading Campaigns..."
                      />
              )}

              {!isLoading && campaigns.length === 0 && (
                <p className='font-epilogue font-semibold text-[14px] text-[#818183]'>
                    You have not created any campaigns yet.
                </p>
              )}

              {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => 
                <FundCard 
                    key = {uuidv4()}
                    { ...campaign}
                    handleClick = {() => handleNavigate(campaign)}
                />
            )}
        </div>
    </div>
  )
}

export default DisplayCampaigns