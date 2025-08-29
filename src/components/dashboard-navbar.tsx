"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "./ui/sidebar";
import { useSession } from "@/lib/auth-client";

export default function DashboardNavbar() {
    const { data: session } = useSession();
    return (
        <>
            <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="font-bold text-xl">Nexus</span>
                </div>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={session ? session?.user.image as string : "https://github.com/quantinium3"} />
                                <AvatarFallback>{session?.user.name}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
}
