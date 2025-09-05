"use client"

import { useState } from "react"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PublicProfileForm } from "@/components/profile/public-profile-form"
import { AccountForm } from "@/components/profile/account-form"
import { useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("public-profile")
  const { data: session, isPending } = useSession()

  if (!isPending && !session) {
    redirect("/signup")
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cyan-500 text-2xl">Loading...</div>
      </div>
    )
  }

  const user = session?.user

  if (!user) {
    return null
  }

  const profileUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <ProfileHeader user={user} />
        <div className="flex">
          <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="flex-1">
            {activeSection === "public-profile" && <PublicProfileForm user={profileUser} />}
            {activeSection === "account" && <AccountForm user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}
