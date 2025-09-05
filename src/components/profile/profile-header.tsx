"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState } from "react";

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-cyan-500 text-2xl">Loading...</div>
      </div>
    )
  }

  const handleButtonClick = () => {
    setLoading(true);
    router.push('/dashboard');
  };

  
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">Your personal account</p>
        </div>
      </div>
      <Button onClick={handleButtonClick} variant="outline" size="sm" className="cursor-pointer">
       Dashboard
      </Button>
    </div>
  )
}