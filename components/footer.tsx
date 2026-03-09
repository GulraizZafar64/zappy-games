import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Mail, ShieldCheck, Zap, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-zappy-green flex items-center justify-center">
                <Zap className="h-5 w-5 text-black fill-black" />
              </div>
              <span className="text-xl font-black font-orbitron tracking-tighter uppercase group-hover:text-zappy-green transition-colors">
                Zappy<span className="text-zappy-green">Games</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
              The ultimate browser gaming protocol. 100% Free. zero lag. pure adrenaline. playing now on the edge.
            </p>
            <div className="flex space-x-3">
              {[Twitter, Discord, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white/5 hover:bg-zappy-green text-gray-400 hover:text-black transition-all border border-white/5">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Core Categories */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-orbitron">Core Categories</h4>
            <ul className="space-y-3">
              {["Racing Games", "Shooting Ops", "Action Missions", "Puzzle Solving"].map((item) => (
                <li key={item}>
                  <Link href={`/games?category=${item.split(' ')[0]}`} className="text-gray-500 hover:text-zappy-green text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <div className="h-1 w-1 bg-white/10 group-hover:bg-zappy-green" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-orbitron">Network</h4>
            <ul className="space-y-3">
              {["About Protocol", "FAQ Center", "Contact Uplink", "System Status", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().includes('privacy') ? 'privacy' : item.toLowerCase().includes('terms') ? 'terms' : item.toLowerCase().split(' ')[0]}`} className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <div className="h-px w-2 bg-white/10 group-hover:bg-zappy-green group-hover:w-4 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-orbitron">Zappy System</h4>
            <div className="p-4 bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <Globe className="h-3 w-3 text-zappy-green" /> Nodes Active
                </span>
                <span className="text-[9px] font-black text-zappy-green animate-pulse">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck className="h-3 w-3 text-zappy-green" /> Firewall
                </span>
                <span className="text-[9px] font-black text-zappy-green">SECURE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Zappy Games // All Rights Reserved // Gamer Protocol v4.2
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
