"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Newspaper, Home, ScrollText, LineChart, Menu, X, Edit, User, Settings, LogOut } from "lucide-react"
import WalletConnect from "@/components/wallet/WalletConnect"
import { useWallet } from "@/context/WalletContext"
import { shortenAddress } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { address, isConnected } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Articles", path: "/articles", icon: <ScrollText className="h-4 w-4" /> },
    { name: "Tokenomics", path: "/tokenomics", icon: <LineChart className="h-4 w-4" /> },
  ]

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 p-2.5 mr-3 shadow-lg transition-all duration-300 group-hover:shadow-blue-200/50 group-hover:scale-105">
                <Newspaper className="h-5 w-5 text-white" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  Mini Blogs
                </span>
                <span className="text-xs text-blue-400 font-medium">Share your thoughts</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-full p-1 flex items-center shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative group flex items-center space-x-2 py-2 px-4 rounded-full transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 shadow-md"
                      : "text-blue-700 hover:bg-blue-100/80"
                  }`}
                >
                  <span className={`transition-all duration-300 ${isActive(link.path) ? "text-white" : ""}`}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WalletConnect />
            </div>

            <Link to="/create-article" className="hidden md:block">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 font-medium"
              >
                <Edit className="h-4 w-4 mr-2" />
                Write
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full hover:bg-transparent">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <img src="/public/pfp.jpg" alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-lg border border-blue-100">
                <div className="flex items-center gap-3 p-2 mb-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100">
                    <img src="/public/pfp.jpg" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">John Doe</span>
                    <span className="text-xs text-gray-500">
                      {isConnected ? shortenAddress(address) : "Not connected"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-2 cursor-pointer">
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2 cursor-pointer text-red-500 hover:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-blue-50/50 border-t border-blue-100 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-auto">
          <div className="py-5 px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between py-3.5 px-5 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md"
                    : "text-blue-700 hover:bg-blue-100/80"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${isActive(link.path) ? "bg-blue-700/30" : "bg-blue-100"} p-2.5 rounded-lg`}>
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </div>
                {isActive(link.path) && <div className="w-2 h-2 rounded-full bg-white shadow-inner"></div>}
              </Link>
            ))}

            <div className="mt-6 pt-5 border-t border-blue-100/50 space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <WalletConnect />
              </div>

              <Link
                to="/create-article"
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-4 px-5 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Edit className="h-5 w-5 mr-3" />
                <span className="font-medium">Write Article</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

