"use client"

import { cn } from "@/lib/utils"
import { User, Settings } from "lucide-react"

interface ProfileSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function ProfileSidebar({ activeSection, onSectionChange }: ProfileSidebarProps) {
  const sections = [
    { id: "public-profile", label: "Public profile", icon: User },
    { id: "account", label: "Account", icon: Settings },
  ]

  return (
    <div className="w-80 bg-background border-r border-border p-6">
      <div className="space-y-6">
        <div>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                    activeSection === section.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
