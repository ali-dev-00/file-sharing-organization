
// import { Doc } from "../../../../convex/_generated/dataModel";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Protect } from '@clerk/nextjs'
// import { MoreVertical, StarHalfIcon, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useState } from "react";
// import { useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { useToast } from "@/hooks/use-toast";


// function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
//     const { toast } = useToast();

//     const toggleFavorite = useMutation(api.files.toggleFavorite);

//     const deleteFile = useMutation(api.files.deleteFile);
//     const restoreFile = useMutation(api.files.restoreFile);


//     const [isConfirmOpen, setisConfirmOpen] = useState(false)
//     return (
//         <>

//             <AlertDialog open={isConfirmOpen} onOpenChange={setisConfirmOpen} >
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             File will be deleted after 24 hours, You can restore File in Trash
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={async () => {
//                             await deleteFile({
//                                 fileId: file._id
//                             });
//                             toast({
//                                 variant: "default",
//                                 title: "Your File is Marked For Deletion",
//                                 description: "Your File will be deleted soon"
//                             })
//                         }} >Continue</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>


//             <DropdownMenu>
//                 <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
//                 <DropdownMenuContent  >
//                     <DropdownMenuItem onClick={() => {
//                         toggleFavorite({ fileId: file._id })
//                     }} className="flex gap-1items-center cursor-pointer">
//                         {isFavorited ? (
//                             <div className="flex gap-1 items-center" >
//                                 <StarHalfIcon className="w-4 h-4" />  Unfavorite
//                             </div>
//                         ) : (
//                             <div className="flex gap-1 items-center" >
//                                 <StarIcon className="w-4 h-4" />Favorite
//                             </div>
//                         )}

//                     </DropdownMenuItem>

//                     <Protect
//                         role="org:admin"
//                         fallback={<></>}
//                     >
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem onClick={() => {
//                             if (file.shouldDelete) {
//                                 restoreFile({
//                                     fileId: file._id
//                                 })
//                             } else {
//                                 setisConfirmOpen(true)
//                             }

//                         }} className="flex gap-1 items-center cursor-pointer">
//                             {file.shouldDelete ?
//                                 <div className="flex gap-1 text-green-600 items-center cursor-pointer">
//                                     <UndoIcon className="w-4 h-4" />  Restore
//                                 </div>
//                                 : <div className="flex gap-1 text-red-600 items-center cursor-pointer">
//                                     <TrashIcon className="w-4 h-4" /> Delete
//                                 </div>
//                             }

//                         </DropdownMenuItem>
//                     </Protect>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </>
//     )
// }