"use client"

import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Page() {
    return (
        <div className="flex justify-center py-10 md:px-10">
            <div className="flex w-full max-w-md flex-col gap-5">
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
    );
}
