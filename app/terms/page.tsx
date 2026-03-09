import { ArrowLeft, Shield, Scale, FileText, Lock, Globe, Mail } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & Conditions | ZappyGames",
  description: "Read the Terms & Conditions of using ZappyGames. Learn about user responsibilities, prohibited uses, and legal guidelines for our gaming protocol.",
  metadataBase: new URL("https://zappygames.online"),
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  const lastUpdated = "March 9, 2026"

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0a0b]">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-zappy-green hover:text-zappy-green/80 transition-colors mb-8 font-orbitron text-xs tracking-widest uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Nexus</span>
        </Link>

        <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-zappy-green/10 border border-zappy-green/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-zappy-green" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zappy-green font-orbitron">Legal Protocol</p>
              <h1 className="text-4xl md:text-5xl font-black text-white font-orbitron uppercase tracking-tighter">
                Terms <span className="text-zappy-green">&</span> Conditions
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-10">Last Updated: {lastUpdated} · Effective Immediately</p>

          <div className="prose prose-invert max-w-none space-y-10 text-gray-400">

            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">1. Agreement to Terms</h2>
              </div>
              <p className="leading-relaxed">
                By accessing <strong className="text-white">ZappyGames</strong> (zappygames.online), you agree to comply with and be bound by these Terms and Conditions. Our platform is a gaming transmission service; if you do not agree with any part of these protocols, you must terminate your connection immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">2. Intellectual Property</h2>
              </div>
              <p className="leading-relaxed">
                The content, games, and layout of ZappyGames are protected by copyright and intellectual property laws. We transmit games via licensed APIs and embedded protocols. Users are granted a temporary, non-exclusive license for personal entertainment only.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Commercial use of any transmission is strictly prohibited.</li>
                <li>Reproduction or redistribution of game assets is a violation of these terms.</li>
                <li>Attempting to scrap, reverse engineer, or "rip" content from the platform is prohibited.</li>
              </ul>
            </section>

            {/* Section 3 — AdSense & User Behavior */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">3. User Responsibilities</h2>
              </div>
              <p className="leading-relaxed">
                To maintain the integrity of our gaming environment, all users must adhere to the following code of conduct:
              </p>
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
                <p className="text-white font-bold text-xs font-orbitron uppercase tracking-wider">Prohibited Actions:</p>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-zappy-green">»</span>
                    Using ad-blockers that interfere with the site's economic protocol (Google AdSense).
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zappy-green">»</span>
                    Automating game play via scripts, bots, or external software.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zappy-green">»</span>
                    Injecting malicious code or attempting to bypass security filters.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zappy-green">»</span>
                    Posting offensive or fraudulent content in public transmission areas (e.g., comments).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">4. Disclaimer of Liability</h2>
              </div>
              <p className="leading-relaxed">
                ZappyGames provides content "as-is" without any warranties. As a transmission hub for third-party games, we are not responsible for the performance, content, or stability of individual game files. We are not liable for any data loss, hardware damage, or system interruptions resulting from site usage.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">5. Third-Party Content</h2>
              <p className="leading-relaxed">
                Our platform integrates third-party advertisements (Google AdSense) and external game APIs. We do not control these third-party services and are not liable for their content or privacy practices. Your interaction with third-party links is at your own risk.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">6. Contact Info</h2>
              </div>
              <p className="leading-relaxed">
                For legal inquiries or protocol clarification, please contact our administrative terminal:
              </p>
              <div className="bg-white/5 rounded-xl p-4 space-y-1 text-sm">
                <p><strong className="text-white">ZappyGames Protocol Admin</strong></p>
                <p>Website: <a href="https://zappygames.online" className="text-zappy-green hover:underline">zappygames.online</a></p>
                <p>Contact: <Link href="/contact" className="text-zappy-green hover:underline">Communication Terminal</Link></p>
              </div>
            </section>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-gray-600">Terms Protocol v2.5</span>
              <span className="text-zappy-green">Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

