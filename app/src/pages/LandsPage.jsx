
import NavBar from "../components/NavBar"

import SearchBar from "../components/SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import {useLocalizations} from "../hooks/useLocalizations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InsertLand from "../forms/InsertLand";
import Land from "../components/Land";

import EditLand from "../forms/EditLand";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";

export default function LandsPage({}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.warning);
    
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
    const [editLandID, setEditLandID] = useState();
    const request = useRequest();

    useEffect(() => {
        loadingUpdate(true);
        request("/api/land_purposes/get", {credentials:"include"}).then(result => {
            if(!result.error) {
                setLandPurposes(result.data)
            }
            loadingUpdate(false);
        })
        search()
    }, []);

    const search = () => {
        loadingUpdate(true);
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
                loadingUpdate(false);
            })
    }

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/lands/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land:ID})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
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
                            <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0} onChange={(e) => setSearchFilters(prev => ({...prev, low_area_filter:e.target.value}))}/>
                        </section>
                        <section className="ml-1 w-[100px]">
                            <h1 className="font-bold">Poniżej ha</h1>
                            <input type="number" placeholder="ha..." className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" min={0} onChange={(e) => setSearchFilters(prev => ({...prev, high_area_filter:e.target.value}))}/>
                        </section>
                        </>
                    }
                    
                    />
                    <section className="my-10">
                       {
                            lands.map((obj, index) => {
                                return ( <Land index={index} obj={obj} key={index} requestDelete={requestDelete} editLand={(ID) => {setForm("edit");setEditLandID(ID)}}/>)
                            })
                       }
                    </section>
                    <button className="base-btn text-2xl" onClick={() => {
                            setForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nową działkę</button>
                    </>
                }
                {
                    form == "insert" && <InsertLand onClose={() => {setForm(""); search()}}/>
                }
                {
                    form == "edit" && <EditLand onClose={() => {setForm(""); search()}} editLandID={editLandID}/>
                }
            </section>
        </main>
    )
}