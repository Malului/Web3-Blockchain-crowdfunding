import React,{ useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun } from '../assets';
import { navlinks } from '../constants';

const Icon =({ 
          styles, 
          name, 
          imgUrl, 
          isActive, 
          disabled, 
          handleClick
        }) => (
          <div className={`w-[60px] h-[50px] rounded-[10px] group ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
                     {!isActive ? (
       <>
        <img 
          src={imgUrl} 
          alt={`${name} icon`}
          className="w-7 h-7 hover:scale-110 transition-transform duration-200" 
        />
        <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 px-2 py-1 bg-[#2c2f32] rounded text-white text-xs whitespace-nowrap transition-opacity duration-200">
          {name}
        </span>
      </>
    ) : (
      <>
        <img 
          src={imgUrl} 
          alt={`${name} icon`}
          className={`w-7 h-7 hover:scale-110 transition-transform duration-200 
            ${isActive !== name && 'grayscale hover:grayscale-0'}`} 
        />
        <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 px-2 py-1 bg-[#2c2f32] rounded text-white text-xs whitespace-nowrap transition-opacity duration-200 capitalize">
          {name}
        </span>
      </>
    )}
          </div>
)

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');

    return(
      <div className='flex flex-col justify-between items-center sticky top-5 h-[93vh]'>
        <Link to="/">
          <Icon 
            styles="w-[52px] h-[52px] bg-[#2c2f32]" 
            imgUrl={logo}
          />
        </Link>

        <div className='flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[15px] py-4 mt-12'>
            <div className='flex flex-col justify-center items-center gap-3'>
                {navlinks.map((link) => (
                  <Icon 
                    key={link.name}
                    {...link}
                    isActive={isActive}
                    handleClick={() => {
                      if(!link.disabled) {
                        setIsActive(link.name);
                        navigate(link.link);
                      }
                    }}
                  />
                ))}
            </div>

           <Icon 
          styles='bg-[#1c1c24] shadow-secondary'
          imgUrl={sun}
        /> 
        </div>
      </div>
    )
}

export default Sidebar



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// import { logo, sun } from '../assets';
// import { navlinks } from '../constants';

// const Icon = ({ 
//   styles, 
//   name, 
//   imgUrl, 
//   isActive, 
//   disabled, 
//   handleClick 
// }) => (
//   <div 
//     className={`relative w-[60px] h-[50px] flex flex-col items-center gap-1 p-2 rounded-[10px] group
//     ${isActive && isActive === name && 'bg-[#2c2f32]'} 
//     ${!disabled && 'cursor-pointer'} 
//     ${styles}`} 
//     onClick={handleClick}
//   >
//     {!isActive ? (
//       <>
//         <img 
//           src={imgUrl} 
//           alt={`${name} icon`}
//           className="w-6 h-6 hover:scale-110 transition-transform duration-200" 
//         />
//         <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 px-2 py-1 bg-[#2c2f32] rounded text-white text-xs whitespace-nowrap transition-opacity duration-200">
//           {name}
//         </span>
//       </>
//     ) : (
//       <>
//         <img 
//           src={imgUrl} 
//           alt={`${name} icon`}
//           className={`w-7 h-7 hover:scale-110 transition-transform duration-200 
//             ${isActive !== name && 'grayscale hover:grayscale-0'}`} 
//         />
//         <span className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 px-2 py-1 bg-[#2c2f32] rounded text-white text-xs whitespace-nowrap transition-opacity duration-200 capitalize">
//           {name}
//         </span>
//       </>
//     )}
//   </div>
// );

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [isActive, setIsActive] = useState('dashboard');

//   return (
//     <div className="flex flex-col justify-between items-center sticky top-5 h-[93vh]">
//       <Link to="/">
//         <Icon 
//           styles="w-[52px] h-[52px] bg-[#2c2f32]" 
//           imgUrl={logo}
//         />
//       </Link>

//       <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] py-4 mt-12">
//         <div className="flex flex-col justify-center items-center gap-3">
//           {navlinks.map((link) => (
//             <Icon 
//               key={link.name}
//               {...link}
//               isActive={isActive}
//               handleClick={() => {
//                 if(!link.disabled) {
//                   setIsActive(link.name);
//                   navigate(link.link);
//                 }
//               }}
//             />
//           ))}
//         </div>

//         <Icon 
//           styles="bg-[#1c1c24] shadow-secondary"
//           imgUrl={sun}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;