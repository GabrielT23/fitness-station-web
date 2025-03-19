// Layout component
import DrawerMenu from '@/components/menu/DrawerMenu'
import { AppProvider } from '@/hooks'
import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <DrawerMenu />
      
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen z-1">
        <div className="max-w-6xl mx-auto">
        <AppProvider>
          {children}
        </AppProvider>
        </div>
      </main>
    </div>
  )
}

export default Layout