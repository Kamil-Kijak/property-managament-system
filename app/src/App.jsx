
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { createContext, useState, useEffect, useMemo} from "react"

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import LandsPage from "./pages/LandsPage";
import UsersPage from "./pages/UsersPage";
import LandTypesPage from "./pages/LandTypesPage";
import LandPurposesPage from "./pages/LandPurposesPage";
import GeneralPlansPage from "./pages/GeneralPlansPage";
import MpzpPage from "./pages/MpzpPage";

import LoadingScreen from "./components/screens/LoadingScreen";
import ErrorScreen from "./components/screens/ErrorScreen";
import OwnersPage from "./pages/OwnersPage";

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

    const screenContextValue = useMemo(() => ({
        "loading": {
            value: screens.loading,
            set: (value) => SetScreens(prev => ({ ...prev, loading: value }))
        },
        "warning": {
            value: screens.warning,
            set: (value) => SetScreens(prev => ({ ...prev, warning: value }))
        },
        "error": {
            value: screens.error,
            set: (value) => SetScreens(prev => ({ ...prev, error: value }))
        }
    }), [screens]);

    const userContextValue = useMemo(() => (
        {
            value:user,
            set:(value) => setUser(value)
        }
    ), [user])

    return (
        <userContext.Provider value={userContextValue}>
            <screenContext.Provider value={screenContextValue}>
                <LoadingScreen/>
                <ErrorScreen/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage/> }/>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/lands" element={<LandsPage/>}/>
                        <Route path="/owners" element={<OwnersPage/>}/>
                        <Route path="/renters" element={<h1>Hello world</h1>}/>
                        <Route path="/areas" element={<h1>Hello world</h1>}/>
                        <Route path="/groundclasses" element={<h1>Hello world</h1>}/>
                        <Route path="/users" element={<UsersPage/>}/>
                        <Route path="/landtypes" element={<LandTypesPage/>}/>
                        <Route path="/landpurposes" element={<LandPurposesPage/>}/>
                        <Route path="/generalplans" element={<GeneralPlansPage/>}/>
                        <Route path="/mpzp" element={<MpzpPage/>}/>
                    </Routes>
                </BrowserRouter>
            </screenContext.Provider>
        </userContext.Provider>
    )
}
export {userContext, screenContext}