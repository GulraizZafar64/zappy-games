"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Head from "next/head"
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
