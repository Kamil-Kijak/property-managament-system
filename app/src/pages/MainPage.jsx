
import { useContext, useEffect } from "react"
import {useNavigate} from "react-router-dom"
import { userContext } from "../App";

export default function MainPage({}) {
    const user = useContext(userContext)
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
                    navigate("/login")
                } else {
                    user.set(data.user);
                }
            } catch(err) {
                
            }
        }
        auth()
    }, [])

    return(
        <nav>
            <h1>{user.value.imie}</h1>
            <h1>{user.value.nazwisko}</h1>
        </nav>
    )
}