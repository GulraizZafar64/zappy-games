import { ArrowLeft } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | ZappyGames</title>
        <meta
          name="description"
          content="Read the Terms & Conditions of using ZappyGames. Learn about user responsibilities, prohibited uses, account rules, and content guidelines."
        />
        <link rel="canonical" href="https://zappygames.online/terms" />
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
          <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">Terms & Conditions</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using ZappyGames, you accept and agree to be bound by the terms and provision of this
                agreement. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Use License</h2>
              <p className="text-gray-300 leading-relaxed">
                Permission is granted to temporarily access the games on ZappyGames for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
              <p className="text-gray-300 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Prohibited Uses</h2>
              <p className="text-gray-300 leading-relaxed">
                You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You
                may not violate any international, federal, provincial, or state regulations, rules, or laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Content</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, or other material. You are responsible for the content that you post to the service,
                including its legality, reliability, and appropriateness.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at{" "}
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
