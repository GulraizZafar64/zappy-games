
import type React from "react"
import { Metadata } from "next"
import ContactMainPage from "./contact-us"
export const metadata: Metadata = {
 title: "Contact Us - ZappyGames",
 description: "Get in touch with ZappyGames for support, partnerships, or general inquiries. We're here to help!",
 metadataBase: new URL("https://zappygames.online"),
 alternates: {
   canonical: "/contact",
 },
}
export default function ContactPage() {

  return (
   <ContactMainPage/>
   
  )
}
