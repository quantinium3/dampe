import React from 'react';
export function CloudBackground() {
  return <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-32 h-16 bg-white rounded-full opacity-80 animate-float"></div>
      <div className="absolute top-[25%] right-[10%] w-40 h-20 bg-white rounded-full opacity-70 animate-float-slow"></div>
      <div className="absolute top-[60%] left-[15%] w-36 h-18 bg-white rounded-full opacity-75 animate-float-medium"></div>
      <div className="absolute top-[75%] right-[20%] w-28 h-14 bg-white rounded-full opacity-65 animate-float-slow"></div>
      <div className="absolute top-[40%] left-[30%] w-44 h-22 bg-white rounded-full opacity-60 animate-float-medium"></div>
      <div className="absolute top-[15%] right-[35%] w-32 h-16 bg-white rounded-full opacity-70 animate-float"></div>
      <div className="absolute top-[85%] left-[40%] w-36 h-18 bg-white rounded-full opacity-80 animate-float-slow"></div>
    </div>;
}