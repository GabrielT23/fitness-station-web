// components/menu/DrawerMenu.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaTimes, FaBars, FaUsers, FaRegChartBar, FaPlusCircle } from 'react-icons/fa'

const DrawerMenu = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/users', label: 'Usuários', icon: FaUsers },
    { href: '/workout-sheets', label: 'Fichas de Treino', icon: FaRegChartBar },
    { href: '/workout-sheets/create', label: 'Criar Ficha', icon: FaPlusCircle },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed md:relative md:translate-x-0 top-0 left-0 posis h-lvh w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold">Administração</h2>
          <button
            className="md:hidden p-1 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    pathname === item.href ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 text-lg" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default DrawerMenu