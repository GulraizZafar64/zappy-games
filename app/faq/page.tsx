import { Metadata } from "next"
import FAQMainPage from "./fqa"
export const metadata: Metadata = {
 title: "FAQ - ZappyGames",
 description: "Find answers to frequently asked questions about ZappyGames, including gameplay, accounts, devices, and support.",
 metadataBase: new URL("https://zappygames.online"),
 alternates: {
   canonical: "/faq",
 },
}
export default function FAQPage() {
  return (
  <FAQMainPage/>
  
  )
}
