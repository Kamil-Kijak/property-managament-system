import { create } from "zustand";


const useScrollStore = create((set) => ({
    pixels:0,
    update:(pixels) => set({pixels:pixels})
}));

export {useScrollStore}