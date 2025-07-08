
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { createContext, useState } from "react"

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

const userContext = createContext(null);

export default function App({}) {
    const [user, setUser] = useState({});
    return (
        <userContext.Provider value={user}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/" element={<MainPage/>}/>
                </Routes>
            </BrowserRouter>
        </userContext.Provider>
    )
}
export {userContext}