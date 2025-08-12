
import { create } from "zustand";

const useUserStore = create((set) => ({
    user:{
        imie:"",
        nazwisko:"",
        rola:"",
        ID:-1
    },
    update:(user) => set({user:user})
}))

export {useUserStore}