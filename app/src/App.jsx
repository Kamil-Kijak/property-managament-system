
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { createContext, useState } from "react"

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

import LoadingScreen from "./components/LoadingScreen";

const userContext = createContext(null);
const screenContext = createContext(null);

export default function App({}) {
    const [user, setUser] = useState({});
    const [screens, SetScreens] = useState({
        "loading":false,
        "warning":false
    });
    return (
        <userContext.Provider value={{
            value:user,
            set:(value) => setUser(value)
        }}>
            <screenContext.Provider value={{
                "loading":{
                    value:screens.loading,
                    set:(value) => SetScreens(prev => ({...prev, loading:value}))
                },
                "warning":{
                    value:screens.warning,
                    set:(value) => SetScreens(prev => ({...prev, warning:value}))
                }
            }}>
                <LoadingScreen active={screens.loading} />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/" element={<MainPage/>}/>
                    </Routes>
                </BrowserRouter>
            </screenContext.Provider>
        </userContext.Provider>
    )
}
export {userContext, screenContext}