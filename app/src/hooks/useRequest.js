import { useNavigate } from "react-router-dom";


const useRequest = () => {
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
            console.error(err);
            return {
                success:false,
                serverError:true,
                error:err
            }
        }
    }
    return fetchRequest;
}

export {useRequest}