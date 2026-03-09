"use client"

import { useState, useEffect } from "react"
import { User, Mail, Send, MessageSquare, ShieldAlert, Loader2 } from "lucide-react"

interface CommentData {
  _id?: string
  name: string
  message: string
  createdAt?: string
  date?: string // Fallback
}

export function CommentSection({ gameUrl }: { gameUrl: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<CommentData[]>([])

  useEffect(() => {
    fetchComments()
  }, [gameUrl])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?gameUrl=${encodeURIComponent(gameUrl)}`)
      const data = await res.json()
      if (data.comments) {
        setComments(data.comments)
      }
    } catch (e) {
      console.error("Failed to fetch comments", e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameUrl, name, email, message })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.comment) {
          setComments([data.comment, ...comments])
          setName("")
          setEmail("")
          setMessage("")
        }
      }
    } catch (e) {
      console.error("Failed to post comment", e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-2 bg-zappy-green shadow-[0_0_20px_rgba(169,255,77,0.6)]" />
        <div>
          <h2 className="text-3xl font-black font-orbitron uppercase tracking-tighter text-white">
            Player <span className="text-zappy-green">Comms</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Neural Transmission Network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Comment Form */}
        <div className="space-y-6">
          <div className="bg-[#111113] border border-white/10 p-8 relative overflow-hidden group rounded-sm shadow-xl">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-zappy-green/5 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] font-orbitron">
                  Establish <span className="text-zappy-green">Uplink</span>
                </h3>
                <MessageSquare className="w-5 h-5 text-zappy-green opacity-40" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                      Signal Handle *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="IDENTIFY YOURSELF..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 px-12 py-4 text-xs font-bold font-orbitron tracking-widest focus:outline-none focus:border-zappy-green focus:ring-1 focus:ring-zappy-green/50 text-white placeholder:text-gray-700 transition-all rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                      Frequency (Email)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="OPTIONAL..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 px-12 py-4 text-xs font-bold font-orbitron tracking-widest focus:outline-none focus:border-zappy-green focus:ring-1 focus:ring-zappy-green/50 text-white placeholder:text-gray-700 transition-all rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                    Direct Transmission *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="ENCODE MESSAGE..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-4 py-4 text-[13px] font-medium tracking-wide focus:outline-none focus:border-zappy-green focus:ring-1 focus:ring-zappy-green/50 text-white placeholder:text-gray-700 transition-all rounded-sm resize-none min-h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zappy-green hover:bg-zappy-green-bright text-black py-4 font-black text-xs uppercase tracking-[0.4em] font-orbitron flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(169,255,77,0.2)] hover:shadow-[0_0_25px_rgba(169,255,77,0.4)]"
                >
                  {isSubmitting ? (
                    "ENCRYPTING..."
                  ) : (
                    <>
                      SEND SIGNAL
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="bg-zappy-green/5 border border-zappy-green/10 p-3 flex items-center gap-3 rounded-sm">
                  <ShieldAlert className="w-4 h-4 text-zappy-green shrink-0" />
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    SECURED PROTOCOL // ALL DATA ENCRYPTED // FILTERED FOR SYSTEM INTEGRITY.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Comments Feed */}
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar no-scrollbar scroll-smooth">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-50 bg-[#111113]/30 border border-dashed border-white/5 rounded-sm">
               <div className="relative">
                 <Loader2 className="w-10 h-10 animate-spin text-zappy-green" />
                 <div className="absolute inset-0 blur-lg bg-zappy-green/20 animate-pulse" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.8em] text-zappy-green animate-pulse">Scanning Waves...</span>
             </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div 
                  key={comment._id || index}
                  className="group bg-[#111113] border-l-4 border-white/5 hover:border-zappy-green p-6 space-y-4 transition-all hover:bg-[#141416] animate-in fade-in slide-in-from-right-4 duration-500 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle Grid Pattern for each comment */}
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-sm bg-zappy-green/10 flex items-center justify-center border border-zappy-green/20">
                          <User className="w-3 h-3 text-zappy-green" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider font-orbitron group-hover:text-zappy-green transition-colors">
                          {comment.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        [{formatDate(comment.createdAt || comment.date)}]
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium pt-3 pl-1 border-l border-white/10 ml-2 group-hover:border-zappy-green/30 transition-colors">
                      {comment.message}
                    </p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 border border-white/5 bg-[#111113]/20 rounded-sm">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group animate-pulse">
                    <MessageSquare className="w-8 h-8 text-gray-600 group-hover:text-zappy-green" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-gray-500">Silence in the Nexus</p>
                    <p className="text-[9px] text-gray-700 mt-2 font-bold uppercase tracking-widest">Be the first to transmit a signal.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

