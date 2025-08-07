import { create } from "zustand";


const useScrollStore = create((set) => ({
    pixels:0,
    updatePixels:(pixels) => set({pixels:pixels})
}));

export {useScrollStore}