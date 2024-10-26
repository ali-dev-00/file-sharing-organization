import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarIcon, TextIcon, TrashIcon, TypeIcon } from "lucide-react"
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

function FileCardActions({ file }: { file: Doc<"files"> }) {
    const { toast } = useToast();
    
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    
    const deleteFile = useMutation(api.files.deleteFile);


    const [isConfirmOpen, setisConfirmOpen] = useState(false)
    return (
        <>

            <AlertDialog open={isConfirmOpen} onOpenChange={setisConfirmOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your file.
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
                                title: "File Deleted",
                                description: "Your File is Deleted Successfully"
                            })
                        }} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent  >
                    <DropdownMenuItem onClick={() => {
                  toggleFavorite({fileId:file._id})
                    }} className="flex gap-1items-center cursor-pointer">
                        <StarIcon className="w-4 h-4" /> Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => {
                        setisConfirmOpen(true)
                    }} className="flex gap-1 text-red-600 items-center cursor-pointer">
                        <TrashIcon className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function FileCard({ file }: { file: Doc<"files"> }) {
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], React.ReactNode>;

    const fileUrl = useQuery(api.files.getFilesWithUrls);

    const fileWithUrl = fileUrl?.find(f => f.fileId === file.fileId);

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    {typeIcons[file.type]} {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
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
            <CardFooter>
                <Button
               onClick={() => {
                if (fileWithUrl && fileWithUrl.url) {
                    window.open(fileWithUrl.url, "_blank"); // Ensure the URL is valid before opening
                } else {
                    alert("File URL not available.");
                }
            }}>
                    Download
                </Button>
            </CardFooter>
        </Card>
    );

}