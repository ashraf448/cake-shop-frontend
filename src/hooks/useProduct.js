import React from 'react'
import useWashlist from "../zustand/wishlistSlice"
export default function useProduct() {

const likeOrDislike = useWashlist(s =>s.likeOrDislike)
const wishlistHandler = (id , price , discount , stock , image , title)=>{


    likeOrDislike(id , price , discount , stock , image , title)
}


  return {wishlistHandler}
}
