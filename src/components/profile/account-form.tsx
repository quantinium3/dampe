"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Calendar, Mail, User, Shield, AlertTriangle } from "lucide-react"

interface AccountFormProps {
    user: {
        id: string
        name: string
        email: string
        emailVerified: boolean
        createdAt: Date
        updatedAt: Date
        image?: string | null
    }
}

export function AccountForm({ user }: AccountFormProps) {
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        bio: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
                
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log("Account updated:", formData)
        } catch (error) {
            console.error("Update failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            console.log("Image selected:", file)
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    return (
        <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <User className="h-8 w-8" />
                    <h2 className="text-3xl font-bold">Profile Settings</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <div className="relative mx-auto">
                                <Avatar className="h-24 w-24 mx-auto">
                                    <AvatarImage src={user.image || undefined} alt={user.name} />
                                    <AvatarFallback className="text-lg">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80">
                                    <Camera className="h-4 w-4 text-primary-foreground" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                            <CardTitle className="mt-4">{user.name}</CardTitle>
                            <CardDescription className="flex items-center justify-center">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={user.emailVerified ? "default" : "secondary"} className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    {user.emailVerified ? "Verified" : "Unverified"}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Member since</span>
                                <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(user.createdAt)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Update your account details and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="account-name">Full Name</Label>
                                        <Input
                                            id="account-name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value })
                                                if (errors.name) setErrors({ ...errors, name: "" })
                                            }}
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="account-email">Email Address</Label>
                                        <Input
                                            id="account-email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value })
                                                if (errors.email) setErrors({ ...errors, email: "" })
                                            }}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${user.emailVerified ? "bg-green-500" : "bg-yellow-500"}`} />
                                            <span className="text-sm text-muted-foreground">
                                                {user.emailVerified ? "Email verified" : "Email not verified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="account-bio">Bio</Label>
                                    <Textarea
                                        id="account-bio"
                                        placeholder="Tell us a bit about yourself..."
                                        value={formData.bio}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isLoading ? "Updating..." : "Update Profile"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Account Activity</CardTitle>
                            <CardDescription>Overview of your account activity and statistics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-primary">{Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}</div>
                                    <div className="text-sm text-muted-foreground">Days Active</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3 border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>Irreversible and destructive actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-red-600">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data associated to it...</p>
                                </div>
                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
