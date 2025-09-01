"use client"

import SettingsNavbar from "@/components/settings/navbar"
import SettingsSidebar, { SettingsPages } from "@/components/settings/sidebar"
import { useState } from "react"

export default function SettingsPage() {
    const [currentPage, setCurrentPage] = useState('profile')
    const CurrentComponent = SettingsPages[currentPage]?.component || SettingsPages['profile'].component

    return (
        <>
            <SettingsSidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <section className="w-full">
                <div className="container mx-auto">
                    <div>
                        <SettingsNavbar title={SettingsPages[currentPage]?.title} />
                    </div>
                    <CurrentComponent />
                </div>
            </section>
        </>
    )
}
