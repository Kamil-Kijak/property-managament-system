import { useRequest } from "./useRequest"

import {useLoadingStore} from "../stores/useScreensStore"

import MpzpData from "../../data/mpzp.json"
import GeneralPlansData from "../../data/generalPlans.json"
import LandPurposesData from "../../data/LandPurposes.json"
import LandTypesData from "../../data/landTypes.json"


const useApi = () => {
    const request = useRequest();
    const loadingUpdate = useLoadingStore((state) => state.update);

    const postOptions = (data) => ({
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(data)
        });

    const requestFromApi = async (url, options) => {
        loadingUpdate(true);
        const result = await request(url, options);
        loadingUpdate(false);
        return result;
    }
    const requestFromApiLite = async (url, options) => {
        const result = await request(url, options);
        return result;
    }
    
    const getUsers = async () => {
        return await requestFromApi("/api/user/get", {});
    }
    const registerAdmin = async (data) => {
        return await requestFromApi("/api/user/register_admin", postOptions(data));
    }
    const loginUser = async (data) => {
        return await requestFromApi("/api/user/login", postOptions(data));
    }
    const insertUser = async (data) => {
        return await requestFromApi("/api/user/insert", postOptions(data));
    }

    const updateUser = async (data) => {
        return await requestFromApi("/api/user/update", postOptions(data));
    }
    const deleteUser = async (data) => {
        return await requestFromApi("/api/user/delete", postOptions(data));
    }
    const updatePassword = async (data) => {
        return await requestFromApi("/api/user/update_password", postOptions(data));
    }
    const userLogout = async () => {
        return await requestFromApi("/api/user/logout", {credentials:"include"});
    }
    const auth = async () => {
        return await requestFromApi("/api/user/auth", {credentials:"include"});
    }
    const getMpzp = async () => {
        return await requestFromApi("/api/mpzp/get", {});
    }
    const deleteMpzp = async (data) => {
        return await requestFromApi("/api/mpzp/delete", postOptions(data));
    }
    const updateMpzp = async (data) => {
        return await requestFromApi("/api/mpzp/update", postOptions(data));
    }
    const insertMpzp = async (data) => {
        return await requestFromApi("/api/mpzp/insert", postOptions(data));
    }
    const insertManyMpzp = async () => {
        return await requestFromApi("/api/mpzp/insert_many", postOptions({data:MpzpData}))
    }
    const getGeneralPlans = async () => {
        return await requestFromApi("/api/general_plans/get", {});
    }
    const deleteGeneralPlan = async (data) => {
        return await requestFromApi("/api/general_plans/delete", postOptions(data));
    }
    const updateGeneralPlan = async (data) => {
        return await requestFromApi("/api/general_plans/update", postOptions(data));
    }
    const insertGeneralPlan = async (data) => {
        return await requestFromApi("/api/general_plans/insert", postOptions(data));
    }
    const insertManyGeneralPlans = async (data) => {
        return await requestFromApi("/api/general_plans/insert_many", postOptions({data:GeneralPlansData}));
    }
    const getLandPurposes = async () => {
        return await requestFromApi("/api/land_purposes/get", {});
    }
    const deleteLandPurpose = async (data) => {
        return await requestFromApi("/api/land_purposes/delete", postOptions(data));
    }
    const updateLandPurpose = async (data) => {
        return await requestFromApi("/api/land_purposes/update", postOptions(data));
    }
    const insertLandPurpose = async (data) => {
        return await requestFromApi("/api/land_purposes/insert", postOptions(data));
    }
    const insertManyLandPurposes = async () => {
        return await requestFromApi("/api/land_purposes/insert_many", postOptions({data:LandPurposesData}));
    }
    const getLandTypes = async () => {
        return await requestFromApi("/api/land_types/get", {});
    }
    const deleteLandType = async (data) => {
        return await requestFromApi("/api/land_types/delete", postOptions(data));
    }
    const updateLandType = async (data) => {
        return await requestFromApi("/api/land_types/update", postOptions(data));
    }
    const insertLandType = async (data) => {
        return await requestFromApi("/api/land_types/insert", postOptions(data));
    }
    const insertManyLandTypes = async () => {
        return await requestFromApi("/api/land_types/insert_many", postOptions({data:LandTypesData}));
    }

    const getOwners = async (params) => {
        return await requestFromApi(`/api/owners/get?${params.toString()}`,  {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const deleteOwner = async (data) => {
        return await requestFromApi("/api/owners/delete", postOptions(data));
    }
    const updateOwner = async (data) => {
        return await requestFromApi("/api/owners/update", postOptions(data));
    }

    const insertOwner = async (data) => {
        return await requestFromApi("/api/owners/insert", postOptions(data));
    }
    const getDistricts = async (params) => {
        return await requestFromApi(`/api/districts/get?${params.toString()}`,  {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const getTowns = async (params) => {
        return await requestFromApiLite(`/api/districts/get_towns?${params.toString()}`,  {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const updateDistricts = async (data) => {
        return await requestFromApi("/api/districts/update", postOptions(data));
    }
    const getGroundClasses = async (params) => {
        return await requestFromApi(`/api/ground_classes/get?${params.toString()}`,  {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const deleteGroundClass = async (data) => {
        return await requestFromApi("/api/ground_classes/delete", postOptions(data));
    }
    const updateGroundClass = async (data) => {
        return await requestFromApi("/api/ground_classes/update", postOptions(data));
    }
    const insertGroundClass = async (data) => {
        return await requestFromApi("/api/ground_classes/insert", postOptions(data));
    }
    const getLandGroundClasses = async (params) => {
        return await requestFromApi(`/api/ground_classes/get_land_classes?${params.toString()}`);
    }
    const getAllRenters = async () => {
        return await requestFromApi("/api/renters/get_all", {});
    }
    const getRenters = async (params) => {
        return await requestFromApi(`/api/rents/get?${params.toString()}`, {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const deleteRenter = async (data) => {
        return await requestFromApi("/api/renters/delete", postOptions(data));
    }
    const updateRenter = async (data) => {
        return await requestFromApi("/api/renters/update", postOptions(data));
    }
    const insertRenter = async (data) => {
        return await requestFromApi("/api/renters/insert", postOptions(data));
    }
    const deleteRent = async (data) => {
        return await requestFromApi("/api/rents/delete", postOptions(data));
    }
    const updateRent = async (data) => {
        return await requestFromApi("/api/rents/update", postOptions(data));
    }
    const insertRent = async (data) => {
        return await requestFromApi("/api/rents/insert", postOptions(data));
    }

    const getLands = async (params) => {
        return await requestFromApi(`/api/lands/get?${params.toString()}`, {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    const getLand = async (ID) => {
        return await requestFromApi(`/api/lands/get_land?ID_land=${ID}`, {credentials:"include"});
    }
    const deleteLand = async (data) => {
        return await requestFromApi("/api/lands/delete", postOptions(data));
    }
    const updateLand = async (data) => {
        return await requestFromApi("/api/lands/update", postOptions(data));
    }
    const insertLand = async (data) => {
        return await requestFromApi("/api/lands/insert", postOptions(data));
    }
    const getInsertionRequiredData = async () => {
        return await requestFromApi("/api/lands/get_insertion_required_data", {});
    }
    const updateArea = async (data) => {
        return await requestFromApi("/api/areas/update", postOptions(data));
    }
    const deleteArea = async (data) => {
        return await requestFromApi("/api/areas/delete", postOptions(data));
    }
    const insertArea = async (data) => {
        return await requestFromApi("/api/areas/insert", postOptions(data));
    }

    const fileUpload = async (ID, formData) => {
        return await requestFromApi(`/api/files/upload/${ID}`, {
            method: 'POST',
            credentials:"include",
            body: formData
        });
    }
    const deleteFile = async (ID, filename) => {
        return await requestFromApi(`/api/files/delete`, postOptions({ID, filename}))
    }

    return {
        getUsers, registerAdmin, loginUser, updateUser, deleteUser, updatePassword, userLogout, insertUser, auth,
        getMpzp, deleteMpzp, updateMpzp, insertMpzp, insertManyMpzp,
        getGeneralPlans, deleteGeneralPlan, updateGeneralPlan, insertGeneralPlan,insertManyGeneralPlans,
        getLandPurposes, deleteLandPurpose, updateLandPurpose, insertLandPurpose,insertManyLandPurposes,
        getLandTypes, deleteLandType, updateLandType, insertLandType, insertManyLandTypes,
        getOwners, deleteOwner, updateOwner, insertOwner,
        getDistricts, updateDistricts, getTowns,
        getGroundClasses, deleteGroundClass, updateGroundClass, insertGroundClass,getLandGroundClasses,
        getAllRenters, getRenters, deleteRenter, updateRenter, insertRenter,
        deleteRent, updateRent, insertRent,
        getLands, deleteLand, getInsertionRequiredData, insertLand, getLand, updateLand,
        updateArea, deleteArea, insertArea,
        fileUpload, deleteFile
    }
}
export {useApi}