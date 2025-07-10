
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { createContext, useState, useEffect} from "react"

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import LandsPage from "./pages/LandsPage";
import UsersPage from "./pages/UsersPage";

import LoadingScreen from "./components/LoadingScreen";

const userContext = createContext(null);
const screenContext = createContext(null);

export default function App({}) {
    const [user, setUser] = useState({});
    const [screens, SetScreens] = useState({
        "loading":false,
        "warning":false
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
                }
            }}>
                <LoadingScreen active={screens.loading} />
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
                        <Route path="/landtypes" element={<LandsPage/>}/>
                        <Route path="/landpurposes" element={<LandsPage/>}/>
                        <Route path="/generalplans" element={<LandsPage/>}/>
                        <Route path="/mpzp" element={<LandsPage/>}/>
                    </Routes>
                </BrowserRouter>
            </screenContext.Provider>
        </userContext.Provider>
    )
}
export {userContext, screenContext}