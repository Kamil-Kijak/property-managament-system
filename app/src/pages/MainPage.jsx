
import {useNavigate} from "react-router-dom"

import NavBar from "../components/NavBar";
import { useRequest } from "../hooks/useRequest";

export default function MainPage({}) {
    const navigate = useNavigate();

    const request = useRequest();

    return(
        <main className="flex justify-between">
            <NavBar/>
        </main>
    )
}