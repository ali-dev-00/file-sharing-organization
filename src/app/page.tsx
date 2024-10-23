"use client"
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignOutButton, useOrganization, useUser } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {
 
  const organization  = useOrganization();
  const user = useUser();
  let orgId : string | undefined = undefined ;
  if(organization.isLoaded && user.isLoaded){
   orgId =  organization.organization?.id ??  user.user?.id; 
  }
  const files = useQuery(
    api.files.getFiles , orgId ? {orgId} : "skip"
  );

  const createFile = useMutation(api.files.createFile);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    
    <SignedOut>
    <SignInButton>
      <Button>Sign In</Button>
     </SignInButton>
    </SignedOut>
     

      {files?.map((files) => {
        return <div key={files._id}>{files.name}</div>
      })}
      <Button onClick={() => {
        if(!orgId) return;
        createFile({ 
          name: "hello world",
          orgId 
         });
      }}>
        Click me
      </Button>
    </div>
  );
}
