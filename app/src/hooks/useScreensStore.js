
import {create} from "zustand"

const useWarningStore = create((set) => ({
    active:false,
    title:"",
    onAccept:() => {},
    onCancel:() => {},
    description:null,
    update:(active = false, title = "", onAccept = () => {}, onCancel = () => {}, description = null) => set({active:active, title:title, onAccept:onAccept, onCancel:onCancel, description:description})
}))

const useLoadingStore = create((set) => ({
    active:false,
    update:(active) => set({active:active})
}))
const useErrorStore = create((set) => ({
    active:false,
    update:(active) => set({active:active})
}))

export {useWarningStore, useLoadingStore, useErrorStore}