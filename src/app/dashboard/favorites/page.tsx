'use client'

import { useQuery } from "convex/react"
import { FileBrowser } from "../_components/FileBrowser"
import { api } from "../../../../convex/_generated/api"

export default function FavoritesPage(){

    return(
        <>
         
          <FileBrowser title={"Favorites"}  favorites/>
        </>
    )
}``