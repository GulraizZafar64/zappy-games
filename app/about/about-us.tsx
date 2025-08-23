import { ArrowLeft, Users, Target, Zap, Heart } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
     <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">About ZappyGames</h1>

          <div className="space-y-8">
            <section>
              <p className="text-xl text-gray-300 leading-relaxed">
                ZappyGames is your ultimate destination for free online gaming. We're passionate about bringing you the
                best collection of browser-based games across all genres, from action-packed adventures to mind-bending
                puzzles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To make gaming accessible to everyone, everywhere. We believe that great games shouldn't be locked
                behind paywalls or require expensive hardware. Our platform brings you high-quality gaming experiences
                right in your browser.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <Users className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Community First</h3>
                <p className="text-gray-300">
                  We're building a vibrant community of gamers who share their passion for great games.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <Target className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Quality Games</h3>
                <p className="text-gray-300">
                  Every game on our platform is carefully curated to ensure the best gaming experience.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <Zap className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Instant Play</h3>
                <p className="text-gray-300">
                  No downloads, no installations. Just click and play your favorite games instantly.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <Heart className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Always Free</h3>
                <p className="text-gray-300">
                  Gaming should be fun and accessible. All our games are completely free to play.
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Join Our Journey</h2>
              <p className="text-gray-300 leading-relaxed">
                Whether you're a casual player looking for a quick break or a dedicated gamer seeking your next favorite
                title, ZappyGames has something for everyone. Join our growing community and discover your next gaming
                obsession today!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
   
  )
}
