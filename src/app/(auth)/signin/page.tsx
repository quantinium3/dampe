"use client"

import { CloudBackground } from "@/components/CloudBackground";
import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Page() {
    return (
        <div className="relative flex w-full min-h-screen justify-center items-center bg-gradient-to-b from-blue-400 to-blue-100 p-4">
            <CloudBackground />
            <div className="flex w-full max-w-md flex-col gap-5">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transition-all duration-300">

                    <Tabs defaultValue="signin">
                        <TabsList>
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <SignIn />
                        </TabsContent>
                        <TabsContent value="signup">
                            <SignUp />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
