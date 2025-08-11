import { useRequest } from "./useRequest"

import {useLoadingStore} from "../stores/useScreensStore"


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

    return {
        getUsers, registerAdmin, loginUser, updateUser, deleteUser, updatePassword, userLogout, insertUser, auth,
        getMpzp, deleteMpzp, updateMpzp, insertMpzp,
        getGeneralPlans, deleteGeneralPlan, updateGeneralPlan, insertGeneralPlan,
        getLandPurposes, deleteLandPurpose, updateLandPurpose, insertLandPurpose,
        getLandTypes, deleteLandType, updateLandType, insertLandType
    }
}
export {useApi}