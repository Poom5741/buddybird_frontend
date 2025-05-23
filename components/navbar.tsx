"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bird, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analyze", label: "Analyze" },
    { href: "/map", label: "Map" },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Bird className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">BuddyBirds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
