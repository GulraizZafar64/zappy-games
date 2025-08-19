"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, User, Reply, MessageCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useAuthModal } from "@/hooks/use-auth-modal"
import { supabase } from "@/lib/supabase"

interface Comment {
  id: string
  game_id: string
  user_id: string
  content: string
  parent_id?: string
  created_at: string
  username: string
  replies?: Comment[]
}

interface CommentSectionProps {
  gameId: string
}

export function CommentSection({ gameId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null) // New state for database errors
  const { user, isSupabaseConfigured } = useAuth()
  const { openModal } = useAuthModal()

  useEffect(() => {
    fetchComments()
  }, [gameId, isSupabaseConfigured])

  const fetchComments = async () => {
    setLoading(true)
    setDbError(null) // Clear previous errors

    if (!isSupabaseConfigured) {
      // Load mock comments for preview mode
      setComments([
        {
          id: "1",
          game_id: gameId,
          user_id: "mock-user-1",
          content: "This game is awesome! Great graphics and gameplay.",
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          username: "GameMaster",
          replies: [
            {
              id: "1-1",
              game_id: gameId,
              user_id: "mock-user-2",
              content: "I totally agree! The controls are so smooth.",
              parent_id: "1",
              created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              username: "Player123",
            },
          ],
        },
        {
          id: "2",
          game_id: gameId,
          user_id: "mock-user-3",
          content: "Love the controls, very responsive!",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          username: "GamerPro",
        },
      ])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false })

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setDbError(
            "Comments are not available. Please ensure your Supabase database is set up and tables are created (run the SQL scripts).",
          )
        } else {
          setDbError("Failed to load comments. Please try again later.")
        }
        throw error // Re-throw to be caught by outer catch if needed
      }

      // Organize comments with replies
      const topLevelComments = data?.filter((comment) => !comment.parent_id) || []
      const replies = data?.filter((comment) => comment.parent_id) || []

      const commentsWithReplies = topLevelComments.map((comment) => ({
        ...comment,
        replies: replies.filter((reply) => reply.parent_id === comment.id),
      }))

      setComments(commentsWithReplies)
    } catch (error) {
      console.error("Error fetching comments:", error)
      setComments([])
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDbError(null) // Clear previous errors

    if (!user) {
      openModal("signin")
      return
    }

    if (!newComment.trim() || (!user && !authorName.trim())) return

    if (!isSupabaseConfigured) {
      alert("Comments are not available in preview mode. Please set up the database.")
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.from("comments").insert({
        game_id: gameId,
        user_id: user.id,
        content: newComment.trim(),
        username: user.email?.split("@")[0] || authorName || "Anonymous",
      })

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setDbError("Failed to post comment. Please ensure your Supabase database is set up and tables are created.")
        } else {
          setDbError("Failed to post comment. Please try again.")
        }
        throw error
      }

      setNewComment("")
      setAuthorName("")
      await fetchComments()
    } catch (error) {
      console.error("Error posting comment:", error)
    }

    setSubmitting(false)
  }

  const handleReply = async (parentId: string) => {
    setDbError(null) // Clear previous errors

    if (!user) {
      openModal("signin")
      return
    }

    if (!replyContent.trim()) return

    if (!isSupabaseConfigured) {
      alert("Replies are not available in preview mode. Please set up the database.")
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.from("comments").insert({
        game_id: gameId,
        user_id: user.id,
        content: replyContent.trim(),
        parent_id: parentId,
        username: user.email?.split("@")[0] || "Anonymous",
      })

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setDbError("Failed to post reply. Please ensure your Supabase database is set up and tables are created.")
        } else {
          setDbError("Failed to post reply. Please try again.")
        }
        throw error
      }

      setReplyContent("")
      setReplyingTo(null)
      await fetchComments()
    } catch (error) {
      console.error("Error posting reply:", error)
    }

    setSubmitting(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 animate-pulse">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gray-600 rounded-full w-8 h-8"></div>
              <div className="bg-gray-600 h-4 w-24 rounded"></div>
            </div>
            <div className="bg-gray-600 h-4 w-full rounded mb-2"></div>
            <div className="bg-gray-600 h-4 w-3/4 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dbError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Database Error</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{dbError}</p>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
        <div className="space-y-4">
          {!user && (
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          )}
          <textarea
            placeholder={user ? "Write a comment..." : "Sign in to comment or enter your name above"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim() || (!user && !authorName.trim())}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? "Posting..." : "Post Comment"}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && !dbError ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No comments yet</p>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              {/* Main Comment */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-white font-medium">{comment.username}</p>
                    <p className="text-gray-400 text-sm">{formatTime(comment.created_at)}</p>
                  </div>
                  <p className="text-gray-300 mb-2">{comment.content}</p>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-11 mt-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <textarea
                    placeholder={user ? "Write a reply..." : "Sign in to reply"}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none mb-3"
                    disabled={!user}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={submitting || !replyContent.trim() || !user}
                      className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-1 rounded text-sm transition-colors"
                    >
                      <Send className="h-3 w-3" />
                      <span>{submitting ? "Posting..." : "Reply"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                      className="text-gray-400 hover:text-white px-4 py-1 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 mt-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-3 p-3 bg-gray-700/20 rounded-lg">
                      <div className="bg-pink-600 rounded-full p-1.5 flex-shrink-0">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white font-medium text-sm">{reply.username}</p>
                          <p className="text-gray-400 text-xs">{formatTime(reply.created_at)}</p>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
