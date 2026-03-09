import { ArrowLeft, Shield, Eye, Cookie, Users, FileText, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyMainPage() {
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
              <Shield className="w-6 h-6 text-zappy-green" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zappy-green font-orbitron">Legal Document</p>
              <h1 className="text-4xl md:text-5xl font-black text-white font-orbitron uppercase tracking-tighter">
                Privacy <span className="text-zappy-green">Policy</span>
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-10">Last Updated: {lastUpdated} · Effective Immediately</p>

          <div className="prose prose-invert max-w-none space-y-10 text-gray-400">

            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">1. Introduction</h2>
              </div>
              <p className="leading-relaxed">
                Welcome to <strong className="text-white">ZappyGames</strong> ("we," "our," or "us"), located at <strong className="text-white">zappygames.online</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
              </p>
              <p className="leading-relaxed">
                By using our website, you agree to the collection and use of information as described in this policy. If you do not agree with the terms of this Privacy Policy, please discontinue use of the site.
              </p>
            </section>

            {/* Section 2 — AdSense Critical */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Cookie className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">2. Advertising & Google AdSense</h2>
              </div>
              <p className="leading-relaxed">
                We use <strong className="text-white">Google AdSense</strong> to display advertisements on our website. Google AdSense is a program run by Google LLC that allows website publishers to serve automatically generated text, image, video, or interactive media advertisements that are targeted to site content and audience.
              </p>
              <div className="bg-zappy-green/5 border border-zappy-green/20 rounded-xl p-6 space-y-4">
                <p className="text-white font-bold text-sm font-orbitron uppercase tracking-wider">Google AdSense Disclosure (Required by Google Policy)</p>
                <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                  <li>
                    <strong className="text-white">Third-Party Vendors:</strong> Google and other third-party vendors (ad networks) use cookies to serve ads on our site.
                  </li>
                  <li>
                    <strong className="text-white">DART Cookie:</strong> Google's use of the DART cookie enables it to serve ads based on your visit to our site and other sites on the Internet. DART cookies are used to show relevant ads to you based on content you've viewed.
                  </li>
                  <li>
                    <strong className="text-white">Opt-Out:</strong> You may opt out of the use of the DART cookie by visiting the{" "}
                    <a href="https://policies.google.com/technologies/ads" className="text-zappy-green hover:underline" target="_blank" rel="noopener noreferrer">
                      Google Ad Technology Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-white">Personalized Ads:</strong> Users may opt out of personalized advertising by visiting{" "}
                    <a href="https://www.google.com/settings/ads" className="text-zappy-green hover:underline" target="_blank" rel="noopener noreferrer">
                      Google Ads Settings
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-white">Industry Opt-Out:</strong> Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{" "}
                    <a href="http://www.aboutads.info/choices/" className="text-zappy-green hover:underline" target="_blank" rel="noopener noreferrer">
                      www.aboutads.info
                    </a>
                    .
                  </li>
                </ul>
              </div>
              <p className="leading-relaxed text-sm">
                These third-party ad servers or ad networks use technology to send the advertisements and links that appear on ZappyGames directly to your browser. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by the third-party ad networks to measure the effectiveness of their advertisements and/or to personalize the advertising content that you see.
              </p>
              <p className="leading-relaxed text-sm">
                ZappyGames has no access to or control over these cookies that are used by third-party advertisers. We recommend reviewing the respective privacy policies of these third-party ad servers for more detailed information as well as for instructions about how to opt-out of certain practices.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">3. Information We Collect</h2>
              </div>
              <p className="leading-relaxed">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                <li>
                  <strong className="text-white">Usage Data:</strong> We automatically collect information about how you access and use our service, including your IP address, browser type, browser version, the pages of our site you visit, the time and date of your visit, and the time spent on those pages.
                </li>
                <li>
                  <strong className="text-white">Log Data:</strong> Our servers automatically record information ("Log Data") created by your use of our services. Log data may include information such as your device's IP address, browser type, operating system, the referring web page, and search terms.
                </li>
                <li>
                  <strong className="text-white">Cookies & Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">4. How We Use Your Information</h2>
              </div>
              <p className="leading-relaxed">We use the information we collect in the following ways:</p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                <li>To provide and maintain our service, including monitoring usage</li>
                <li>To deliver relevant, targeted advertisements via Google AdSense</li>
                <li>To analyze traffic and usage patterns to improve the user experience</li>
                <li>To detect and prevent technical issues, fraud, or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">5. Cookies Policy</h2>
              <p className="leading-relaxed">
                Cookies are small pieces of data stored on your device. We use both "session" cookies (which expire when you close your browser) and "persistent" cookies (which remain on your device until you delete them or they expire).
              </p>
              <p className="leading-relaxed">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service, and some advertisements may not function correctly.
              </p>
              <p className="leading-relaxed">
                We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                <li><strong className="text-white">Essential Cookies:</strong> Necessary for the website to function properly.</li>
                <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
                <li><strong className="text-white">Advertising Cookies:</strong> Used by Google AdSense to deliver relevant ads. These include the DART cookie.</li>
                <li><strong className="text-white">Preference Cookies:</strong> Used to remember your preferences and settings.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">6. Third-Party Links</h2>
              <p className="leading-relaxed">
                Our service may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We strongly advise you to review the Privacy Policy of every site you visit.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">7. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">8. Your Rights (GDPR / CCPA)</h2>
              <p className="leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed">
                <li><strong className="text-white">Right to Access:</strong> You can request a copy of the data we hold about you.</li>
                <li><strong className="text-white">Right to Rectification:</strong> You can request that we correct any inaccurate data.</li>
                <li><strong className="text-white">Right to Erasure:</strong> You can request that we delete your personal data.</li>
                <li><strong className="text-white">Right to Opt-Out (CCPA):</strong> California residents have the right to opt-out of the sale of their personal information.</li>
                <li><strong className="text-white">Right to Object:</strong> You can object to our processing of your data for advertising purposes.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Section 10 — Contact */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zappy-green flex-shrink-0" />
                <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">10. Contact Us</h2>
              </div>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-white/5 rounded-xl p-4 space-y-1 text-sm">
                <p><strong className="text-white">ZappyGames</strong></p>
                <p>Website: <a href="https://zappygames.online" className="text-zappy-green hover:underline">zappygames.online</a></p>
                <p>Contact Page: <Link href="/contact" className="text-zappy-green hover:underline">Contact Terminal</Link></p>
              </div>
            </section>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-gray-600">Privacy Policy v3.0</span>
              <span className="text-zappy-green">Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
