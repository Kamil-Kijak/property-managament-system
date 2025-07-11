import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { screenContext } from "../App";

const useRequest = () => {
    const screens = useContext(screenContext);
    const navigate = useNavigate()
    const fetchRequest = async (path, options) => {
        try {
            const res = await fetch(path, options);
            const data = await res.json();
            if(res.status >= 500) {
                throw new Error(data.error)
            }
            if(data.requestRelogin) {
                navigate("/login");
            }
            return data;
        } catch(err) {
            // display error
            screens.error.set(true);
            return {
                success:false,
                serverError:true,
                error:err,
            }
        }
    }
    return fetchRequest;
}

export {useRequest}