
import NavBar from "../components/NavBar"

import { screenContext, userContext } from "../App";
import { useContext } from "react";
import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import {useLocalizations} from "../hooks/useLocalizations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InsertLand from "../forms/InsertLand";

export default function LandsPage({}) {
    const screens = useContext(screenContext);
    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
    const [searchFilters, setSearchFilters] = useState({
        serial_filter:"",
        purpose_filter:"",
        rent_filter:"",
        low_area_filter:"",
        high_area_filter:""
    });
    const [landPurposes, setLandPurposes] = useState([]);
    const [lands, setLands] = useState([]);
    const [form, setForm] = useState("");
    const request = useRequest();

    useEffect(() => {
        screens.loading.set(true);
        request("/api/land_purposes/get", {credentials:"include"}).then(result => {
            if(!result.error) {
                setLandPurposes(result.data)
                screens.loading.set(false);
            }
        })
    }, []);

    const search = () => {
        screens.loading.set(true);
        const params = new URLSearchParams({
            ...searchFilters,
            province_filter: localizations.province,
            district_filter: localizations.district,
            commune_filter: localizations.commune,
            town_filter: localizations.town
        });
        request(`/api/lands/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    setLands(result.data)
                }
                screens.loading.set(false);
            })
    }

    return(
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 pb-5 relative">
                {
                    form == "" && <>
                    <SearchBar
                    onSearch={search}
                    elements={
                        <>
                        <section>
                            <h1 className="font-bold">Numer seryjny</h1>
                            <input type="text" placeholder="land ID..." className="border-2 border-black rounded-md bg-white px-2 py-1"
                             onChange={(e) => setSearchFilters(prev => ({...prev, serial_filter:e.target.value}))}/>
                        </section>
                        <section className="ml-1 w-[150px]">
                            <h1 className="font-bold">Województwo</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" defaultValue={""} onChange={(e) => setLocalizations({district:"", commune:"", town:"", province:e.target.value})}>
                                <option value="" className="hidden">Wybierz</option>
                                {
                                    availableLocalizations.provinces.map((obj) => {
                                        return <option key={obj} value={obj}>{obj}</option>
                                    })
                                }
                            </select>
                        </section>
                        <section className="ml-1 w-[150px]">
                            <h1 className="font-bold">Powiat</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" defaultValue={""} onChange={(e) => setLocalizations(prev => ({...prev, district:e.target.value, commune:"", town:"",}))}>
                                <option value="" className="hidden">Wybierz</option>
                                {
                                    availableLocalizations.districts.map((obj) => {
                                        return <option key={obj} value={obj}>{obj}</option>
                                    })
                                }
                            </select>
                        </section>
                        <section className="ml-1 w-[150px]">
                            <h1 className="font-bold">Gmina</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" defaultValue={""} onChange={(e) => setLocalizations(prev => ({...prev, commune:e.target.value, town:"",}))}>
                                <option value="" className="hidden">Wybierz</option>
                                {
                                    
                                    availableLocalizations.communes.map((obj) => {
                                        return <option key={obj} value={obj}>{obj}</option>
                                    })
                                }
                            </select>
                        </section>
                        <section className="ml-1 w-[150px]">
                            <h1 className="font-bold">Miejscowość</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" defaultValue={""} onChange={(e) => setLocalizations(prev => ({...prev, town:e.target.value,}))}>
                                <option value="" className="hidden">Wybierz</option>
                                {
                                    availableLocalizations.towns.map((obj) => {
                                        return <option key={obj} value={obj}>{obj}</option>
                                    })
                                }
                            </select>
                        </section>
                        <section className="ml-1">
                            <h1 className="font-bold">Przeznaczenie</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setSearchFilters(prev => ({...prev, purpose_filter:e.target.value}))}>
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
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1" defaultValue={""} onChange={(e) => setSearchFilters(prev => ({...prev, rent_filter:e.target.value}))}>
                                <option value="" className="hidden">Wybierz</option>
                                <option value="1">TAK</option>
                                <option value="0">NIE</option>
                            </select>
                        </section>
                        <section className="ml-1 w-[100px]">
                            <h1 className="font-bold">Powyżej ha</h1>
                            <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0} onChange={(e) => setSearchFilters(prev => ({...prev, high_area_filter:e.target.value}))}/>
                        </section>
                        <section className="ml-1 w-[100px]">
                            <h1 className="font-bold">Poniżej ha</h1>
                            <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0} onChange={(e) => setSearchFilters(prev => ({...prev, low_area_filter:e.target.value}))}/>
                        </section>
                        </>
                    }
                    
                    />
                    <section className="my-10">
                        {
                            lands.length == 0 && <h1 className="text-2xl font-bold">Dodaj filtry i kliknij wyszukaj żeby wyszukać działki</h1>
                        }
                    </section>
                    <button className="base-btn text-2xl" onClick={() => {
                            setForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nową działkę</button>
                    </>
                }
                {
                    form == "insert" && <InsertLand onClose={() => setForm("")}/>
                }
            </section>
        </main>
    )
}