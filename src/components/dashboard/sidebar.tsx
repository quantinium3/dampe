import {
    Cloud,
    Upload,
    Trash2,
    Star,
    Clock,
    Users,
    Bot,
    FileText
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"

const mainItems = [
    {
        title: "My Drive",
        url: "/comingSoon",
        icon: Cloud,
    },
    {
        title: "Shared with me",
        url: "/comingSoon",
        icon: Users,
    },
    {
        title: "Recent",
        url: "/comingSoon",
        icon: Clock,
    },
    {
        title: "Starred",
        url: "/comingSoon",
        icon: Star,
    },
    {
        title: "Trash",
        url: "/comingSoon",
        icon: Trash2,
    },
]

const quickActions = [
    {
        title: "Upload Files",
        url: "/dashboard",
        icon: Upload,
    },
]

const aiItems = [
    {
        title: "Document AI",
        url: "/dashboard/document-ai",
        icon: FileText,
    },
]

export default function DashboardSidebar() {
    return (
        <Sidebar className="flex flex-col h-full">
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {quickActions.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Storage</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>AI Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {aiItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                        <Cloud className="h-3 w-3" />
                        <span>Nexu Pro</span>
                    </div>
                    <div>1MB of 10 GB used</div>
                    <div className="pt-2 border-t">
                        <div>© {new Date().getFullYear()} Nexus Inc. All rights reserved.</div>
                    </div>
                    <div className="flex gap-3 text-xs">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Help</a>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
