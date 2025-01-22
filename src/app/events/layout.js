import React, { Suspense } from 'react'
import Loading from './loading'

const layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  )
}

export default layout