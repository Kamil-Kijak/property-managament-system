
import NavBar from "../components/NavBar"

import { userContext } from "../App";
import { useContext } from "react";

export default function LandsPage({}) {
    return(
        <main className="flex justify-between">
            <NavBar/>
            <h1>Hello world</h1>
        </main>
    )
}