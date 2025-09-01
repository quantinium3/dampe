"use client"

import {
    User,
    Shield,
    Palette,
    HardDrive,
    Eye,
    CreditCard,
    Settings
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
    SidebarHeader,
} from "@/components/ui/sidebar"
import ProfileSettings from "./profile";
import AccountSettings from "./account";
import BillingSettings from "./billing";
import PrivacySettings from "./privacy";
import SecuritySettings from "./security";
import AppearanceSettings from "./appearance";
import StorageSettings from "./storage";
import { Dispatch, SetStateAction } from "react";

type SettingsPage = {
    component: React.ComponentType;
    title: string;
};

type SettingsPagesType = {
    [key: string]: SettingsPage;
};

export const SettingsPages: SettingsPagesType = {
    'profile': {
        component: ProfileSettings,
        title: 'Profile Settings'
    },
    'account': {
        component: AccountSettings,
        title: 'Account Settings'
    },
    'billing': {
        component: BillingSettings,
        title: 'Billing Settings'
    },
    'privacy': {
        component: PrivacySettings,
        title: "Privacy Settings"
    },
    'security': {
        component: SecuritySettings,
        title: "Security Settings"
    },
    'appearance': {
        component: AppearanceSettings,
        title: 'Appearance Settings'
    },
    'storage': {
        component: StorageSettings,
        title: 'Storage Settings',
    }
};

const profileItems = [
    {
        title: "Profile Settings",
        key: "profile",
        icon: User,
    },
    {
        title: "Account Settings",
        key: "account",
        icon: Settings,
    },
    {
        title: "Billing & Plans",
        key: "billing",
        icon: CreditCard,
    },
]

const privacyItems = [
    {
        title: "Privacy Controls",
        key: "privacy",
        icon: Eye,
    },
    {
        title: "Security",
        key: "security",
        icon: Shield,
    },
    /* {
        title: "Two-Factor Auth",
        key: "two-factor",
        icon: Lock,
    },
    {
        title: "Connected Apps",
        key: "connected-apps",
        icon: Smartphone,
    }, */
]

const appItems = [
    /* {
        title: "Notifications",
        key: "notifications",
        icon: Bell,
    }, */
    {
        title: "Appearance",
        key: "appearance",
        icon: Palette,
    },
    {
        title: "Storage Settings",
        key: "storage",
        icon: HardDrive,
    },
    /* {
        title: "Sync & Backup",
        key: "sync-backup",
        icon: Download,
    },
    {
        title: "Sharing Settings",
        key: "sharing",
        icon: Share2,
    },
    {
        title: "Public Links",
        key: "public-links",
        icon: Globe,
    }, */
]

/* const supportItems = [
    {
        title: "Help & Support",
        key: "help",
        icon: HelpCircle,
    },
] */

interface SettingsSidebarProps {
    currentPage: string;
    setCurrentPage: Dispatch<SetStateAction<string>>;
}

export default function SettingsSidebar({ currentPage, setCurrentPage }: SettingsSidebarProps) {
    return (
        <Sidebar className="flex flex-col h-full">
            <SidebarHeader className="p-4 border-b">
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span className="font-semibold">Settings</span>
                </div>
            </SidebarHeader>

            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel>Profile & Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {profileItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => setCurrentPage(item.key)}
                                        isActive={currentPage === item.key}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Privacy & Security</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {privacyItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => setCurrentPage(item.key)}
                                        isActive={currentPage === item.key}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>App Preferences</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {appItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => setCurrentPage(item.key)}
                                        isActive={currentPage === item.key}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {supportItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => setCurrentPage(item.key)}
                                        isActive={currentPage === item.key}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>*/}
            </SidebarContent>

            <SidebarFooter className="p-4 space-y-3">
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                    <div>© {new Date().getFullYear()} Nexus Inc. All rights reserved.</div>
                    <div className="flex gap-3">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Help</a>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
