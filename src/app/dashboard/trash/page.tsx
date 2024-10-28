'use client'


import { FileBrowser } from "../_components/FileBrowser"


export default function FavoritesPage(){

    return(
        <>
         
          <FileBrowser title={"Trash"} deletedOnly/>
        </>
    )
}