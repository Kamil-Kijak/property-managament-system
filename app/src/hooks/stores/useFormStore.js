import { create } from "zustand";


const useFormStore = create((set) => ({
    form:null,
    updateForm:(formStatus) => set({form:formStatus})
}));

export {useFormStore}