import React from 'react'

import { loader } from '../assets'

const Loader = ({showMessage= true, customMessage}) => {
  return (
    <div className='fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col'>
        <img
            src={loader}
            alt='loader'
            className='w-[100px] h-[100px] object-contain'
        />

        {showMessage && (
          <p className='mt-[20px] font-epilogue font-bold text-white text-[20px] text-center'>
              {customMessage || 
              "Transaction in progress. Please wait..."
              }
          </p>
        )}

    </div>
  )
}

export default Loader