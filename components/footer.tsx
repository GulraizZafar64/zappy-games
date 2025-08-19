import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white font-orbitron">ZappyGames</h3>
            <p className="text-gray-400">
              Your ultimate destination for free online gaming. Play thousands of games instantly in your browser.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Discord className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Most Played</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games/Subway Surfers" className="text-gray-400 hover:text-white transition-colors">
                  Subway Surfers
                </Link>
              </li>
              <li>
                <Link href="/games/Traffic Rider" className="text-gray-400 hover:text-white transition-colors">
                  Traffic Rider
                </Link>
              </li>
              <li>
                <Link href="/games/BitLife Life Simulator" className="text-gray-400 hover:text-white transition-colors">
                  BitLife Life Simulator
                </Link>
              </li>
              <li>
                <Link href="/games/Skibidi Toilet Hide N Seek" className="text-gray-400 hover:text-white transition-colors">
                 Skibidi Toilet Hide N Seek
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} ZappyGames. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
