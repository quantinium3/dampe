import React from 'react'
import DocumentAIPage from '@/components/documentai'
import DashboardNavbar from '@/components/dashboard/navbar'

const documentAI = () => {
  return (
    <>
      <div>
        <DashboardNavbar />
      </div>

      <div>
        <DocumentAIPage />
      </div>
    </>
  )
}

export default documentAI