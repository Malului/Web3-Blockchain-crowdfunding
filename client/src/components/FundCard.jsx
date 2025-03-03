import React from 'react'

import { tagType, thirdweb } from '../assets'
import { daysLeft } from '../utils/index'

const FundCard = ({ 
    owner, 
    title, 
    description, 
    amountContributed, 
    deadline, 
    imageUrl, 
    goal,
    ended,
    handleClick
}) => {

    const contractDeadline = deadline * 1000;
    const remainingDays = daysLeft(contractDeadline);

  return (
    <div className='sm:w-[280px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer'
        onClick={handleClick}
    >
        <img 
            src={imageUrl} 
            alt="fund"
            className='w-full h-[158px] object-cover rounded-[15px]' 
        />

        <div className='flex flex-col p-4'>
            <div className='flex flex-row items-center mb-[18px]'>
                <img
                    src={tagType}
                    alt='tag'
                    className='w-[17px] h-[17px] object-contain'
                />

                <p className='ml-[12px] mt-[12px] font-epilogue font-medium text-[12px] text-[#808191]'>
                    Category
                </p> 
            </div>

            <div className='block'>
                <h3 className='font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate'>
                    {title}
                </h3>

                <p className='mt-[5px] font-epilogue font-normal text-[#808191] leading-[18px] truncate '>
                    {description}
                </p>
            </div>

            <div className='flex flex-wrap justify-between gap-2 mt-[15px]'>
                <div className='flex flex-col'>
                    <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
                        {amountContributed}
                    </h4>

                    <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>
                        Raised of {goal}
                    </p>
                </div>

                {ended ? (
                    <p className='font-epilogue font-normal text-[12px] leading-[18px] text-[#4acd8d] sm:max-w-[120px] truncate'>
                        Campaign <br /> 
                        Ended
                    </p>
                ) : (
                    remainingDays <= 0 ? (
                        <p className='font-epilogue font-normal text-[12px] leading-[18px] text-[#de6060] sm:max-w-[120px] truncate'>
                            Deadline <br /> 
                            Reached
                        </p>
                    ) : (
                        <div className='flex flex-col'>
                            <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
                                {remainingDays}
                            </h4>

                            <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>
                                Days Left
                            </p>
                        </div>
                    )
                )}

                
            </div>

            <div className='flex items-center mt-[20px] gap-[12px]'>
                <div className='w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]'>
                    <img
                        src={thirdweb}
                        alt='user'
                        className='w-1/2 h-1/2 object-contain'
                    />
                </div>

                <p className='flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate'>
                    by <span className='text-[#b2b3bd] '>
                        {owner}
                    </span>
                </p>
            </div>
         </div>
    </div>
  )
}

export default FundCard