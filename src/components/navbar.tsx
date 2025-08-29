"use client"
import { useSession } from "@/lib/auth-client";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="flex justify-between p-2">
            <div>
                Nexus
            </div>

            <div>
            </div>
        </nav>
    );
}
