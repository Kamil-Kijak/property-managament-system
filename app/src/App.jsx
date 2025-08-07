
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {useEffect} from "react"

import LoginPage from "./pages/LoginPage";
import LandsPage from "./pages/LandsPage";
import UsersPage from "./pages/UsersPage";
import LandTypesPage from "./pages/LandTypesPage";
import LandPurposesPage from "./pages/LandPurposesPage";
import GeneralPlansPage from "./pages/GeneralPlansPage";
import MpzpPage from "./pages/MpzpPage";

import LoadingScreen from "./components/screens/LoadingScreen";
import ErrorScreen from "./components/screens/ErrorScreen";
import OwnersPage from "./pages/OwnersPage";
import WarningScreen from "./components/screens/WarningScreen";
import RentPage from "./pages/RentPage";
import GroundClassesPage from "./pages/GroundClassesPage";
import DistrictsPage from "./pages/DistrictsPage";
import NotFoundPage from "./pages/NotFoundPage";


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
                    <Route path="/login" element={<LoginPage/> }/>
                    <Route path="/" element={<Navigate to={"/lands"}/>}/>
                    <Route path="/lands" element={<LandsPage/>}/>
                    <Route path="/owners" element={<OwnersPage/>}/>
                    <Route path="/renters" element={<RentPage/>}/>
                    <Route path="/groundclasses" element={<GroundClassesPage/>}/>
                    <Route path="/districts" element={<DistrictsPage/>}/>
                    <Route path="/users" element={<UsersPage/>}/>
                    <Route path="/landtypes" element={<LandTypesPage/>}/>
                    <Route path="/landpurposes" element={<LandPurposesPage/>}/>
                    <Route path="/generalplans" element={<GeneralPlansPage/>}/>
                    <Route path="/mpzp" element={<MpzpPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}