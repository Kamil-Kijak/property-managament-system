
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {useEffect} from "react"

import LoginPage from "./pages/plain/LoginPage";
// import LandsPage from "./pages/LandsPage";
import UsersPage from "./pages/showingData/UsersPage";
import LandTypesPage from "./pages/showingData/LandTypesPage";
import LandPurposesPage from "./pages/showingData/LandPurposesPage";
import GeneralPlansPage from "./pages/showingData/GeneralPlansPage";
import MpzpPage from "./pages/showingData/MpzpPage";

import LoadingScreen from "./components/screens/LoadingScreen";
import ErrorScreen from "./components/screens/ErrorScreen";
import WarningScreen from "./components/screens/WarningScreen";
import OwnersPage from "./pages/showingData/OwnersPage";
import RentPage from "./pages/showingData/RentPage";
import GroundClassesPage from "./pages/showingData/GroundClassesPage";
import DistrictsPage from "./pages/showingData/DistrictsPage";
import NotFoundPage from "./pages/plain/NotFoundPage";


export default function App({}) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
        }, []);
    return (
        <>
            <LoadingScreen/>
            <ErrorScreen/>
            <WarningScreen/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/lands"/>}/>
                    <Route path="/login" element={<LoginPage/> }/>
                    <Route path="/users" element={<UsersPage/>}/>
                    <Route path="/mpzp" element={<MpzpPage/>}/>
                    <Route path="/generalplans" element={<GeneralPlansPage/>}/>
                    <Route path="/landpurposes" element={<LandPurposesPage/>}/>
                    <Route path="/landtypes" element={<LandTypesPage/>}/>
                    <Route path="/owners" element={<OwnersPage/>}/>
                    <Route path="/districts" element={<DistrictsPage/>}/>
                    <Route path="/groundclasses" element={<GroundClassesPage/>}/>
                    <Route path="/renters" element={<RentPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}