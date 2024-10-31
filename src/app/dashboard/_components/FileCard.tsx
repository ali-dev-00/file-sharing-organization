import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Protect } from '@clerk/nextjs'
import { DownloadIcon, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalfIcon, StarIcon, TextIcon, TrashIcon, TypeIcon, UndoIcon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

export function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
    const { toast } = useToast();

    const toggleFavorite = useMutation(api.files.toggleFavorite);

    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);

    const me = useQuery(api.users.getMe)

    const [isConfirmOpen, setisConfirmOpen] = useState(false)
    return (
        <>

            <AlertDialog open={isConfirmOpen} onOpenChange={setisConfirmOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            File will be deleted after 24 hours, You can restore File in Trash
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({
                                fileId: file._id
                            });
                            toast({
                                variant: "default",
                                title: "Your File is Marked For Deletion",
                                description: "Your File will be deleted soon"
                            })
                        }} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent  >
                    <DropdownMenuItem onClick={() => {
                        toggleFavorite({ fileId: file._id })
                    }} className="flex gap-1items-center cursor-pointer">
                        {isFavorited ? (
                            <div className="flex gap-1 items-center" >
                                <StarHalfIcon className="w-4 h-4" />  Unfavorite
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center" >
                                <StarIcon className="w-4 h-4" />Favorite
                            </div>
                        )}

                    </DropdownMenuItem>

                    <Protect
                       condition={(check)=>{
                        return check({
                            role: "org:admin",
                        }) || file.userId === me?._id
                       }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            if (file.shouldDelete) {
                                restoreFile({
                                    fileId: file._id
                                })
                            } else {
                                setisConfirmOpen(true)
                            }

                        }} className="flex gap-1 items-center cursor-pointer">
                            {file.shouldDelete ?
                                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                                    <UndoIcon className="w-4 h-4" />  Restore
                                </div>
                                : <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                                    <TrashIcon className="w-4 h-4" /> Delete
                                </div>
                            }

                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function FileCard({ file }: { file: Doc<"files"> & {isFavorited : boolean}}) {
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], React.ReactNode>;

    const fileUrl = useQuery(api.files.getFilesWithUrls);

    const fileWithUrl = fileUrl?.find(f => f.fileId === file.fileId);

   
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId,
    });

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-base font-bold">
                    {typeIcons[file.type]} {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorited={file.isFavorited} file={file} />
                </div>
            </CardHeader>
            <CardContent className="h-[150px] flex justify-center items-center ">
                {fileWithUrl && file.type === 'image' && (
                    <Image
                        src={fileWithUrl.url ?? "Loading"}
                        alt={file.name}
                        width={200}
                        height={200}
                    />
                )}

                {file.type === "csv" && (
                    <GanttChartIcon className="w-20 h-20" />
                )}
                {file.type === "pdf" && (
                    <FileTextIcon className="w-20 h-20" />
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-2" >
                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="leading-none">
                        {userProfile?.name} <br />
                        <small className="text-[11px]" >Uploaded {formatRelative(new Date(file._creationTime), new Date())}</small>
                    </span>

                </div>
                <Button title="Download File" className="w-8 h-8 rounded-full"
                    onClick={() => {
                        if (fileWithUrl && fileWithUrl.url) {
                            window.open(fileWithUrl.url, "_blank"); // Ensure the URL is valid before opening
                        } else {
                            alert("File URL not available.");
                        }
                    }}>
                    <DownloadIcon />
                </Button>


            </CardFooter>
        </Card>
    );

}