"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await axios.get('/api/auth/me')
        setUser(response.data.user)
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setIsLoggedIn(false)
      setUser(null)
      router.push('/')
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Explore", path: "/explore" },
  ]

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and left side nav links - shown on larger screens */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-blue-600">
                AppName
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.path)
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="hidden sm:flex sm:items-center">
            {isLoading ? (
              <div className="w-12 h-5 bg-gray-200 animate-pulse rounded"></div>
            ) : isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-sm text-gray-700 font-medium">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}

          {!isLoading && (
            <>
              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-3 py-1 text-sm text-gray-500">
                      Signed in as <span className="font-medium text-gray-700">{user?.name}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-3 flex flex-col space-y-2 px-3">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <Button className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
