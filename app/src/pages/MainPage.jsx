
import { useEffect } from "react"
import {useNavigate} from "react-router-dom"

export default function MainPage({}) {
    const navigate = useNavigate();
    useEffect(() => {
        const auth = async () => {
            try {
                const res = await fetch("/api/user/auth", {credentials:"include"});
                const data = await res.json();
                if(res.status > 499) {
                    throw new Error(data.error)
                }
                if(data.requestRelogin) {
                    navigate("/login");
                }
            } catch(err) {
                
            }
        }
        auth()
    }, [])

    return(
        <h1>Main Page</h1>
    )
}