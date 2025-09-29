"use client"
import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { link } from "fs/promises";

export default function Navbar() {
    const { data: session } = useSession();

    const handleNexus = () => {
        window.location.href = "/";
    }

    const handleDashboardClick = () => {
        if (session) {
            window.location.href = "/dashboard";
        }
    }
    const handleSignOutClick = async () => {
        if (session) {
            await fetch("/api/auth/signout", { method: "POST" });
            window.location.href = "/";
        }
    }
    const handleProfileClick = () => {
        window.location.href = "/profile";
    }

    const handleSignIn = async () => {
        if (!session) {
            window.location.href = "/signin"
        }
    }

    return (
        <nav className="flex items-center justify-between p-4 border-b border-b-slate-200">
            <div className="font-bold text-2xl">
                <Button variant="outline" className="text-lg hover:bg-cyan-400" onClick={handleNexus}>Nexus</Button>
            </div>

            <div>
                {session && (
                    <>
                        <Button variant="link" className="cursor-pointer text-lg" onClick={handleDashboardClick}>
                            Dashboard
                        </Button>
                        <Button variant="link" className="cursor-pointer text-lg" onClick={handleProfileClick}>
                            Profile
                        </Button>
                        <Button variant="link" className="cursor-pointer text-lg" onClick={handleSignOutClick}>
                            SignOut
                        </Button>
                    </>
                )}
                {!session && (
                    <Button variant="link" className="cursor-pointer text-lg" onClick={handleSignIn}>
                        SignIn
                    </Button>
                )}
            </div>
            <div>
            </div>
        </nav>
    );
}

