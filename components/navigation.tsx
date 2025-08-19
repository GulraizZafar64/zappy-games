"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Gamepad2, Sparkles, User, LogOut, Settings, Heart, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAuthModal } from "@/hooks/use-auth-modal"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, signOut } = useAuth()
  const { openModal } = useAuthModal()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="flex items-center space-x-3 text-white hover:text-purple-400 transition-all duration-300 group"
          >
            <div className="relative">
              <Gamepad2 className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-400 animate-pulse" />
            </div>
            <span className="text-2xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              ZappyGames
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {["Home", "All Games", "Contact Us", "About Us"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : item === "All Games" ? "/games" : item === "Contact Us" ? "/contact" : item === "About Us" ? "/about" : `/${item.toLowerCase()}`}
                className="relative text-white hover:text-purple-400 transition-all duration-300 group py-2"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            ))}

            {/* {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg border border-purple-500/20 shadow-2xl">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-purple-500/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/liked"
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-purple-500/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Liked Games</span>
                      </Link>
                      <Link
                        href="/recent"
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-purple-500/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Clock className="h-4 w-4" />
                        <span>Recent Games</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-purple-500/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-white hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openModal("signin")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
              >
                Sign In
              </button>
            )} */}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-purple-500/20"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top duration-300 bg-black/90 backdrop-blur-xl rounded-lg mt-2 border border-purple-500/20">
           {["Home", "All Games", "Contact Us", "About Us"].map((item) => (
              <Link
                key={item}
                 href={item === "Home" ? "/" : item === "All Games" ? "/games" : item === "Contact Us" ? "/contact" : item === "About Us" ? "/about" : `/${item.toLowerCase()}`}
                className="block text-white hover:text-purple-400 transition-colors py-3 px-4 rounded-lg hover:bg-purple-500/20"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* {user ? (
              <div className="border-t border-purple-500/20 pt-2">
                <Link
                  href="/profile"
                  className="block text-white hover:text-purple-400 transition-colors py-3 px-4 rounded-lg hover:bg-purple-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/liked"
                  className="block text-white hover:text-purple-400 transition-colors py-3 px-4 rounded-lg hover:bg-purple-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Liked Games
                </Link>
                <Link
                  href="/recent"
                  className="block text-white hover:text-purple-400 transition-colors py-3 px-4 rounded-lg hover:bg-purple-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Recent Games
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-white hover:text-red-400 transition-colors py-3 px-4 rounded-lg hover:bg-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openModal("signin")
                  setIsOpen(false)
                }}
                className="block w-full text-left text-white hover:text-purple-400 transition-colors py-3 px-4 rounded-lg hover:bg-purple-500/20"
              >
                Sign In
              </button>
            )} */}
          </div>
        )}
      </div>
    </nav>
  )
}
