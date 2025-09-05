"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PublicProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

export function PublicProfileForm({ user }: PublicProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Name changed successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl">
        <h2 className="text-2xl text-cyan-600 font-semibold mb-8 underline">Public profile</h2>

        <div className="flex gap-8">
          <div className="flex-1 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="max-w-md"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Your Public Name
                </p>
              </div>

              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update profile"}
              </Button>
            </form>
          </div>

          <div className="w-80">
            <div className="space-y-2">
              <Label>Profile picture</Label>
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
