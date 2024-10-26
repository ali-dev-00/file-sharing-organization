"use client"

import { useOrganization, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadBtn } from "./UploadBtn";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "@/app/dashboard/_components/SearchBar";
import { useState } from "react";
import { FileCard } from "./FileCard";


function PlaceHolder() {
  return (
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

  )
}

export  function FileBrowser({title ,favoritesOnly } : {title :string , favoritesOnly?: boolean}) {

 
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("")

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites,
    orgId ? {orgId} : "skip"
  );
  const files = useQuery(
    api.files.getFiles, orgId ? { orgId, query ,favorites : favoritesOnly} : "skip"
  );
  const isLoading = files === undefined


  return (


        <div className="w-full" >
          {
            isLoading &&
            <div className="mt-12 flex flex-col gap-8 items-center" >
              <Loader2 className="h-28 w-28 animate-spin text-gray-500" />
              <div className="text-2xl" >Loading your images ...</div>
            </div>

          }

          {!isLoading && (
            <>
              <div className="flex justify-between items-center mb-8" >
                <h1 className="text-4xl font-bold ">{title}</h1>
                <SearchBar setQuery={setQuery} query={query} />
                <UploadBtn />
              </div>

              {files?.length === 0 &&
                <PlaceHolder />
              }

              <div className="grid grid-cols-3 gap-4">
                {files?.map((file) => {
                  return <FileCard favorites={favorites ?? []} key={file._id} file={file} />
                })}
              </div>

            </>
          )}
        </div>
      
  );
}
