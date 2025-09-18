'use client'

import React from 'react'
import { useSession } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Cloud, Search, Shield, Zap } from "lucide-react"

export default function Landing() {
    const { data: session } = useSession();
    const handleDashboardClick = () => {
        if (session) {
            window.location.href = "/dashboard";
        }else{
            window.location.href = "/signin";
        }
    }

        return (

            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Store Here, Access Anywhere <span className="text-cyan-500">Powered by Tokito-AI</span>
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Store, organize, and find your files instantly with this intelligent cloud storage platform. Access
                        everything from anywhere using just your Gmail account.
                        <br />
                        <span className="text-cyan-400 font-bold">[Mist Breathing 5th Form]</span>
                    </p>
                    <div className="flex gap-4 justify-center">
                            <Button onClick={handleDashboardClick} variant="default" size="lg" className="text-lg px-8 py-3 cursor-pointer">
                                Get Started Here..
                            </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-3 cursor-pointer bg-transparent">
                            Slay More
                        </Button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
                    <Card className="text-center hover:bg-gray-50">
                        <CardHeader>
                            <Cloud className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                            <CardTitle>Cloud Storage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Secure file storage accessible from anywhere in the world</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:bg-gray-50">
                        <CardHeader>
                            <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                            <CardTitle>AI-Powered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Smart categorization and content analysis for all your files</CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:bg-gray-50">
                        <CardHeader>
                            <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <CardTitle>Smart Search</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Find files by content, not just names. Search inside documents and images
                            </CardDescription>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:bg-gray-50">
                        <CardHeader>
                            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                            <CardTitle>Secure Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Gmail-based authentication with security</CardDescription>
                        </CardContent>
                    </Card>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-700 mb-2">1GB</div>
                            <div className="text-sm text-gray-600">Free Storage</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-cyan-700 mb-2">AI-Powered</div>
                            <div className="text-gray-600">Smart Organization</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-700 mb-2">Anywhere</div>
                            <div className="text-sm text-gray-600">Access Your Files</div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }


