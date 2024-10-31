"use client"

import { useOrganization, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadBtn } from "./UploadBtn";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import { SearchBar } from "@/app/dashboard/_components/SearchBar";
import { useState } from "react";
import { FileCard } from "./FileCard";
import { DataTable } from "./FileTable"
import { columns } from "./Coloumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export function FileBrowser({ title, favoritesOnly, deletedOnly }:
  { title: string, favoritesOnly?: boolean, deletedOnly?: boolean }) {


  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("")

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );
  const files = useQuery(
    api.files.getFiles, orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip"
  );
  const isLoading = files === undefined

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div className="w-full" >
          <div className="flex justify-between items-center mb-8" >
            <h1 className="text-4xl font-bold ">{title}</h1>
            <SearchBar setQuery={setQuery} query={query} />
            <UploadBtn />
          </div>

          <Tabs defaultValue="grid">
            <TabsList className="mb-2">
              <TabsTrigger value="grid" className="flex gap-2 items-center" >
                <GridIcon /> Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center">
                <RowsIcon />  Table
              </TabsTrigger>
            </TabsList>
            {
              isLoading &&
              <div className="mt-12 flex flex-col gap-8 items-center" >
                <Loader2 className="h-28 w-28 animate-spin text-gray-500" />
                <div className="text-2xl" >Loading your Files ...</div>
              </div>

            }
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modifiedFiles?.map((file) => {
                  return <FileCard key={file._id} file={file} />;
                })}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>
          
          {files?.length === 0 &&
            <PlaceHolder />
          }
      
    </div>

  );
}
