"use client"

import { Play, Search, Heart, User, Gamepad2 } from "lucide-react"

export function HowToPlay() {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Browse & Search",
      description: "Explore our vast collection of games or use the search bar to find your favorites.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: "Click & Play",
      description: "Simply click on any game card to start playing instantly in your browser.",
      color: "from-green-500 to-emerald-500",
    },
    // {
    //   icon: <User className="h-8 w-8" />,
    //   title: "Create Account",
    //   description: "Sign up for free to save your progress, like games, and track your gaming history.",
    //   color: "from-purple-500 to-violet-500",
    // },
    // {
    //   icon: <Heart className="h-8 w-8" />,
    //   title: "Like & Save",
    //   description: "Heart your favorite games to easily find them later in your liked games collection.",
    //   color: "from-pink-500 to-rose-500",
    // },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Enjoy Gaming",
      description: "Play unlimited games for free with no downloads required. Just pure gaming fun!",
      color: "from-orange-500 to-amber-500",
    },
  ]

  return (
    <section className="px-4 py-20 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">How to Play</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Get started with our gaming platform in just a few simple steps
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6" />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 font-orbitron">Ready to Start Gaming?</h3>
            <p className="text-gray-400 mb-6">
              Join thousands of players enjoying unlimited free games right in their browser!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold">
                Browse Games
              </button>
              <button className="border border-purple-500 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-500/10 transition-all duration-300 font-semibold">
                Sign Up Free
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
