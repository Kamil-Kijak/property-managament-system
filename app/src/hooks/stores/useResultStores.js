
import { create } from "zustand";

const useUsersStore = create((set) => ({
    users:[],
    editID:0,
    updateUsers:(users) => set({users:users}),
    updateID:(ID) => set({editID:ID})
}));
const useGeneralPlansStore = create((set) => ({
    generalPlans:[],
    editID:0,
    updateGeneralPlans:(generalPlans) => set({generalPlans:generalPlans}),
    updateID:(ID) => set({editID:ID})
}));
const useDistrictsStore = create((set) => ({
    districts:[],
    editID:0,
    updateDistricts:(districts) => set({districts:districts}),
    updateID:(ID) => set({editID:ID})
}));
const useMpzpStore = create((set) => ({
    mpzp:[],
    editID:0,
    updateMpzp:(mpzp) => set({mpzp:mpzp}),
    updateID:(ID) => set({editID:ID})
}));
const useLandTypesStore = create((set) => ({
    landTypes:[],
    editID:0,
    updateLandTypes:(landTypes) => set({landTypes:landTypes}),
    updateID:(ID) => set({editID:ID})
}));
const useLandPurposesStore = create((set) => ({
    landPurposes:[],
    editID:0,
    updateLandPurposes:(landPurposes) => set({landPurposes:landPurposes}),
    updateID:(ID) => set({editID:ID})
}));
const useOwnersStore = create((set) => ({
    owners:[],
    editID:0,
    updateOwners:(owners) => set({owners:owners}),
    updateID:(ID) => set({editID:ID})
}));
const useGroundClassesStore = create((set) => ({
    groundClasses:[],
    editID:0,
    updateGroundClasses:(groundClasses) => set({groundClasses:groundClasses}),
    updateID:(ID) => set({editID:ID})
}));


export {useUsersStore, useGeneralPlansStore, useDistrictsStore, useMpzpStore, useOwnersStore, useLandTypesStore, useLandPurposesStore, useGroundClassesStore}