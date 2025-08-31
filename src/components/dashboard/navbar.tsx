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
import { signOut, useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";

export default function DashboardNavbar() {
    const { data: session } = useSession();

    return (
        <>
            <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="font-bold text-xl">Nexus</span>
                </div>

                {session ? (
                    <div className="flex gap-3">
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
                                    <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Button onClick={() => redirect("/signin")}>Sign in</Button>
                    </div>
                )}
            </div >
        </>
    );
}
