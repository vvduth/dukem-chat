import React from 'react'

const AppWrapper = ({
    children,
}: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
        {/* toolbar goes here */}
      <main>
        {children}
      </main>
    </div>
  )
}

export default AppWrapper
