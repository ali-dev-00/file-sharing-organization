"use client"

import { useOrganization, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadBtn } from "./UploadBtn";
import { FileCard } from "./FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function Home() {

  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles, orgId ? { orgId } : "skip"
  );
  const isLoading = files === undefined
  return (
    <div className="container mx-auto pt-12 ">
      { 
        isLoading && 
        <div className="mt-12 flex flex-col gap-8 items-center" >
          <Loader2 className="h-28 w-28 animate-spin text-gray-500"/>
          <div className="text-2xl" >Loading your images ...</div>
        </div>

      }
      { !isLoading && files.length === 0 && (
        <div className="mt-12 flex flex-col gap-8 items-center" >
          <Image
            alt="an image of a picture and directory"
            width={200}
            height={200}
            src={"/empty.svg"}
          />
          <div className="text-2xl">
            You have no Files , Upload one now !!!
          </div>
          <UploadBtn />
        </div>
      )}
      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8" >
            <h1 className="text-4xl font-bold ">Your Files</h1>
            <UploadBtn />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>

        </>
      )}




    </div>
  );
}
