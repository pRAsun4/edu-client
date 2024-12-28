import React from 'react'

export default function DashLayout({ children, className, headerTitle }) {
  return (
    <>
      <div className={`dash-card w-full overflow-hidden flex flex-col items-center ${className} `}>
        <span className='w-full pb-5 inline-flex border-b'>
          <h2 className="h5 font-medium tracking-[0.44px] ">{headerTitle}</h2>
        </span>
        <div className={`dash-data w-full mt-5  flex flex-col items-center   gap-5 `}>
          {children}
        </div>
      </div>
    </>
  )
}
