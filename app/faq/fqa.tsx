"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import Head from "next/head"

const faqs = [
  {
    question: "Are all games really free to play?",
    answer:
      "Yes! All games on ZappyGames are completely free to play. We believe gaming should be accessible to everyone without any cost barriers.",
  },
  {
    question: "Do I need to create an account to play games?",
    answer:
      "No account is required to play games. However, creating an account allows you to save your progress, track your favorite games, and access additional features.",
  },
  {
    question: "Can I play games on mobile devices?",
    answer:
      "Our games are optimized for both desktop and mobile devices. You can enjoy gaming on your smartphone or tablet with the same great experience.",
  },
  {
    question: "How often do you add new games?",
    answer:
      "We regularly add new games to our platform. Check back frequently or follow us on social media to stay updated on the latest additions.",
  },
  {
    question: "What if a game isn't working properly?",
    answer:
      "If you encounter any issues with a game, please contact our support team through the contact page. We'll work quickly to resolve any problems.",
  },
  {
    question: "Can I suggest games to be added?",
    answer:
      "We love hearing from our community! You can suggest games through our contact form, and we'll consider them for future additions to the platform.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes, we take privacy seriously. Please review our Privacy Policy to learn more about how we protect and handle your information.",
  },
  {
    question: "Can I play games offline?",
    answer:
      "Some games may work offline once loaded, but most require an internet connection. We're working on improving offline capabilities for a better experience.",
  },
]

export default function FAQMainPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <>
    <Head>
  <title>FAQ - ZappyGames</title>
  <meta
    name="description"
    content="Find answers to frequently asked questions about ZappyGames, including gameplay, accounts, devices, and support."
  />
  <link rel="canonical" href="https://zappygames.online/faq" />
</Head>
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
          <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">Frequently Asked Questions</h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-2">Still have questions?</h2>
            <p className="text-gray-300 mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  
  )
}
