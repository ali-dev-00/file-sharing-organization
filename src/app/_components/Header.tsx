import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedIn, SignedOut,  UserButton } from "@clerk/nextjs";
import {  SquareArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="border-b py-4 bg-gray-50"  >
            <div className=" items-center container mx-auto justify-between flex" >
                <div>

                    <Link href="/" className="font-bold flex gap-2 items-center text-xl">
                        <Image src="/logo.png" width="40" height="40" alt="logo" />
                        FileDrive
                    </Link>
                </div>
                <SignedIn>
                    <Link href="/dashboard/files" className="mid-heading" >
                        <Button variant="outline">
                            Start Managing Files <SquareArrowRight />
                        </Button>
                    </Link>
                </SignedIn>
                <div className="flex items-center gap-4">
                <SignedIn>
                    <OrganizationSwitcher />
                    <UserButton />
                </SignedIn>
                    <SignedOut>
                        
                    </SignedOut>
                </div>

            </div>
        </div>
    )
}