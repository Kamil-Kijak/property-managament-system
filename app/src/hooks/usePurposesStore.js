
import { create } from "zustand";

const usePurposesStore = create((set) => ({
    data:[],
    update:(array) => set({data:array})
}))
export {usePurposesStore}