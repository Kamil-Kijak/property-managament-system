
import NavBar from "../components/NavBar"

import { screenContext, userContext } from "../App";
import { useContext } from "react";
import SearchBar from "../components/SearchBar";
import LocalizationData from "../data/output.json"
import { useState } from "react";
import { useEffect } from "react";
import { useRequest } from "../hooks/useRequest";

export default function LandsPage({}) {
    const screens = useContext(screenContext);
    const [localization, setLocalization] = useState({province:"", district:"", commune:"", town:""})
    const [landPurposes, setLandPurposes] = useState([]);
    const request = useRequest();

    useEffect(() => {
        screens.loading.set(true);
        request("/api/land_purposes/get", {credentials:"include"}).then(result => {
            if(!result.error) {
                setLandPurposes(result.data)
                screens.loading.set(false);
            }
        })
    }, [])

    return(
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 relative">
                <SearchBar
                elements={
                    <>
                    <section>
                        <h1 className="font-bold">Numer seryjny</h1>
                        <input type="text" placeholder="land ID..." className="border-2 border-black rounded-md bg-white px-2 py-1"/>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Województwo</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization({district:"", commune:"", town:"", province:e.target.value})}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                Object.keys(LocalizationData).map((obj, index) => {
                                    return <option key={index} value={obj}>{obj}</option>
                                })
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Powiat</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization(prev => ({...prev, district:e.target.value, commune:"", town:"",}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                Object.keys(LocalizationData[localization.province] || {})?.map((obj, index) => {
                                    return <option key={index} value={obj}>{obj}</option>
                                })
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Gmina</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization(prev => ({...prev, commune:e.target.value, town:"",}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                localization.province && localization.district &&
                                Object.keys(LocalizationData[localization.province][localization.district] || {})?.map((obj, index) => {
                                    return <option key={index} value={obj}>{obj}</option>
                                })
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Miejscowość</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization(prev => ({...prev, town:e.target.value,}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                localization.province && localization.district && localization.commune &&
                                (LocalizationData[localization.province][localization.district][localization.commune] || []).map((obj, index) => {
                                    return <option key={index} value={obj}>{obj}</option>
                                })
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Przeznaczenie</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization(prev => ({...prev, town:e.target.value,}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                               landPurposes.map((obj, index) => {
                                return <option key={index} value={obj.typ}>{obj.typ}</option>
                               })
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Dzierżawiona</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setLocalization(prev => ({...prev, town:e.target.value,}))}>
                            <option value="" className="hidden">Wybierz</option>
                            <option value="1">TAK</option>
                            <option value="0">NIE</option>
                        </select>
                    </section>
                    <section className="ml-1 w-[100px]">
                        <h1 className="font-bold">Powyżej ha</h1>
                        <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0}/>
                    </section>
                    <section className="ml-1 w-[100px]">
                        <h1 className="font-bold">Poniżej ha</h1>
                        <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0}/>
                    </section>
                    </>
                }
                
                />
                <section className="my-10">

                </section>
            </section>
        </main>
    )
}