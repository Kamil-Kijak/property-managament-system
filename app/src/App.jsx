
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { createContext, useState, useEffect} from "react"

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import LandsPage from "./pages/LandsPage";
import UsersPage from "./pages/UsersPage";
import LandTypesPage from "./pages/LandTypesPage";
import LandPurposesPage from "./pages/LandPurposesPage";
import GeneralPlansPage from "./pages/GeneralPlansPage";

import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";

const userContext = createContext(null);
const screenContext = createContext(null);

export default function App({}) {
    const [user, setUser] = useState({});
    const [screens, SetScreens] = useState({
        "loading":false,
        "warning":false,
        "error":false
    });
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
        }, []);

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
                },
                "error":{
                    value:screens.error,
                    set:(value) => SetScreens(prev => ({...prev, error:value}))
                }
            }}>
                <LoadingScreen/>
                <ErrorScreen/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage/> }/>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/lands" element={<LandsPage/>}/>
                        <Route path="/owners" element={<LandsPage/>}/>
                        <Route path="/renters" element={<LandsPage/>}/>
                        <Route path="/areas" element={<LandsPage/>}/>
                        <Route path="/groundclasses" element={<LandsPage/>}/>
                        <Route path="/users" element={<UsersPage/>}/>
                        <Route path="/landtypes" element={<LandTypesPage/>}/>
                        <Route path="/landpurposes" element={<LandPurposesPage/>}/>
                        <Route path="/generalplans" element={<GeneralPlansPage/>}/>
                        <Route path="/mpzp" element={<LandsPage/>}/>
                    </Routes>
                </BrowserRouter>
            </screenContext.Provider>
        </userContext.Provider>
    )
}
export {userContext, screenContext}