
import PrivacyPolicyMainPage from "./privacy"
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Privacy Policy - ZappyGames",
 description: "Read the Privacy Policy of ZappyGames to understand how we collect, use, and protect your personal information while you play games online.",
 metadataBase: new URL("https://zappygames.online"),
 alternates: {
   canonical: "/privacy",
 },
}
export default function PrivacyPolicyPage() {
  return (
   <PrivacyPolicyMainPage/>

  )
}
