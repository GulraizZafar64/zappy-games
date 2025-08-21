import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import Head from "next/head"
import Link from "next/link"



export const metadata: Metadata = {
  title: "Privacy Policy - ZappyGames",
  description:
    "Read the Privacy Policy of ZappyGames to understand how we collect, use, and protect your personal information while you play games online.",
  alternates: {
    canonical: "https://zappygames.online/privacy",
  },
  openGraph: {
    title: "Privacy Policy - ZappyGames",
    description:
      "Learn how ZappyGames protects your privacy, handles your data, and ensures a safe gaming experience.",
    url: "https://zappygames.online/privacy",
    siteName: "ZappyGames",
    type: "website",
    images: [
      {
        url: "https://zappygames.online/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZappyGames Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - ZappyGames",
    description:
      "Understand how ZappyGames handles and protects your data with our Privacy Policy.",
    images: ["https://zappygames.online/og-image.jpg"],
  },
}
export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, play games, or
                contact us for support. This may include your email address, username, and gameplay statistics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our gaming platform, including
                personalizing your experience, tracking your progress, and providing customer support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                  our contact page
                </Link>
                .
              </p>
            </section>

            <p className="text-gray-400 text-sm mt-8">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
    </>

  )
}
