
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
import InsertRent from "../forms/InsertRent";
import SearchInput from "../components/inputs/SearchInput"
import SearchSelectInput from "../components/inputs/SearchSelectInput"

export default function LandsPage({}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.warning);
    
    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
    const [searchFilters, setSearchFilters] = useState({
        serial_filter:"",
        land_number_filter:"",
        purpose_filter:"",
        rent_filter:"",
        low_area_filter:"",
        high_area_filter:""
    });
    const [landPurposes, setLandPurposes] = useState([]);
    const [lands, setLands] = useState([]);
    const [form, setForm] = useState(null);
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
                    !form && <>
                    <SearchBar
                    onSearch={search}
                    elements={
                        <>
                        <SearchInput
                            title="Numer seryjny"
                            placeholder="land ID..."
                            value={searchFilters.serial_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, serial_filter:e.target.value}))}
                        />
                        <SearchInput
                            title="Numer działki"
                            placeholder="land number..."
                            value={searchFilters.land_number_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, land_number_filter:e.target.value}))}
                        />
                        <section className="w-[150px]">
                            <SearchSelectInput
                                title="Województwo"
                                placeholder="NaN"
                                value={localizations.province}
                                onChange={(e) => setLocalizations({district:"", commune:"", town:"", province:e.target.value})}
                                options={
                                    <>
                                        {
                                            availableLocalizations.provinces.map((obj) => <option key={obj} value={obj}>{obj}</option>)
                                        }
                                    </>
                                }
                            />
                        </section>
                        <section className="w-[150px]">
                            <SearchSelectInput
                                title="Powiat"
                                placeholder="NaN"
                                value={localizations.district}
                                onChange={(e) => setLocalizations(prev => ({...prev, district:e.target.value, commune:"", town:""}))}
                                options={
                                    <>
                                        {
                                            availableLocalizations.districts.map((obj) => <option key={obj} value={obj}>{obj}</option>)
                                        }
                                    </>
                                }
                            />
                        </section>
                        <section className="w-[150px]">
                            <SearchSelectInput
                                title="Gmina"
                                placeholder="NaN"
                                value={localizations.commune}
                                onChange={(e) => setLocalizations(prev => ({...prev, commune:e.target.value, town:""}))}
                                options={
                                    <>
                                        {
                                            availableLocalizations.communes.map((obj) => <option key={obj} value={obj}>{obj}</option>)
                                        }
                                    </>
                                }
                            />
                        </section>
                        <section className="w-[150px]">
                            <SearchSelectInput
                                title="Miejscowość"
                                placeholder="NaN"
                                value={localizations.town}
                                onChange={(e) => setLocalizations(prev => ({...prev, town:e.target.value,}))}
                                options={
                                    <>
                                        {
                                            availableLocalizations.towns.map((obj) => <option key={obj} value={obj}>{obj}</option>)
                                        }
                                    </>
                                }
                            />
                        </section>
                        <SearchSelectInput
                            title="Przeznaczenie"
                            placeholder="NaN"
                            value={searchFilters.purpose_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, purpose_filter:e.target.value}))}
                            options={
                                <>
                                   {
                                    landPurposes.map((obj, index) => <option key={index} value={obj.typ}>{obj.typ}</option>)
                                    }
                                </>
                            }
                        />
                        <SearchSelectInput
                            title="Dzierżawiona"
                            placeholder="NaN"
                            value={searchFilters.rent_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, rent_filter:e.target.value}))}
                            options={
                                <>
                                    <option value="1">TAK</option>
                                    <option value="0">NIE</option>
                                </>
                            }
                        />
                        <SearchInput
                            type="number"
                            min={0}
                            title="Powyżej ha"
                            placeholder="ha..."
                            value={searchFilters.low_area_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, low_area_filter:e.target.value}))}
                        />
                        <SearchInput
                            type="number"
                            min={0}
                            title="Poniżej ha"
                            placeholder="ha..."
                            value={searchFilters.high_area_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, high_area_filter:e.target.value}))}
                        />
                        </>
                    }
                    
                    />
                    <section className="my-10">
                       {
                            lands.map((obj, index) => {
                                return (<Land
                                    index={index}
                                    obj={obj}
                                    key={index}
                                    requestDelete={requestDelete}
                                    addRent={(ID) => {setForm("addRent");setEditLandID(ID)}}
                                    editLand={(ID) => {setForm("edit");setEditLandID(ID)}}
                                    />)
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
                {
                    form == "addRent" && <InsertRent onClose={() => {setForm(""); search()}} landID={editLandID}/>
                }
            </section>
        </main>
    )
}