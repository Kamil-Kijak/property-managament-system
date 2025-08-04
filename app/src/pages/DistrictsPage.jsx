import { useEffect, useState } from "react";
import SearchSelectInput from "../components/inputs/SearchSelectInput";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import { useLocalizations } from "../hooks/useLocalizations";
import { useLoadingStore} from "../hooks/useScreensStore";
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../hooks/useForm";
import SelectInput from "../components/inputs/SelectInput";
import SimpleInput from "../components/inputs/SimpleInput";


export default function DistrictsPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);

    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();


    const [editFormData, editErrors, setEditFormData] = useForm({
        "tax_district":{regexp:/\d+/, error:"Wybierz okręg"},
        "agricultural_tax":{regexp:/^\d{1,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "forest_tax":{regexp:/^\d{1,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    });

    const [form, setForm] = useState(null);
    const [editDistrictID, setEditDistrictID] = useState(null);
    const [districts, setDistricts] = useState([]);
    const request = useRequest();


    const [searchFilters, setSearchFilters] = useState({
        tax_district:"",
        agricultural_tax:"",
        forest_tax:""
    })
    

    const search = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            ...searchFilters,
            ...localizations
        });
        request(`/api/districts/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    setDistricts(result.data);
                }
                loadingUpdate(false);
            })
    }

    useEffect(() => {
        search()
    }, []);

    const requestEdit = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/districts/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_localization:editDistrictID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })
    }

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                {
                    !form &&
                    <>
                        <SearchBar
                            onSearch={search}
                            elements={
                                <>
                                    <SearchSelectInput
                                        placeholder="NaN"
                                        title="Okręg podatkowy"
                                        onChange={(e) => setSearchFilters(prev => ({...prev, tax_district:e.target.value}))}
                                        value={searchFilters.tax_district}
                                        options={
                                            <>
                                                <option value="1">I</option>
                                                <option value="2">II</option>
                                                <option value="3">III</option>
                                                <option value="4">IV</option>
                                            </>
                                        }
                                    />
                                    <SearchSelectInput
                                        placeholder="NaN"
                                        title="Ma stawke podatku rolnego"
                                        onChange={(e) => setSearchFilters(prev => ({...prev, agricultural_tax:e.target.value}))}
                                        value={searchFilters.agricultural_tax}
                                        options={
                                            <>
                                                <option value="0">NIE</option>
                                                <option value="1">TAK</option>
                                            </>
                                        }
                                    />
                                    <SearchSelectInput
                                        placeholder="NaN"
                                        title="Ma stawke podatku leśnego"
                                        onChange={(e) => setSearchFilters(prev => ({...prev, forest_tax:e.target.value}))}
                                        value={searchFilters.forest_tax}
                                        options={
                                            <>
                                                <option value="0">NIE</option>
                                                <option value="1">TAK</option>
                                            </>
                                        }
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
                                </>
                            }
                        
                        />
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {districts.length}</h1>
                        <section className="my-5">
                            {
                                districts.map((obj, index) => 
                                    <section className="base-card" key={index}>
                                        <section className="flex gap-x-5 items-center">
                                            <section className="flex flex-col items-center justify-center">
                                                <h1 className="font-bold text-md">Lokalizacja</h1>
                                                <p className="mx-10 text-md">{obj.wojewodztwo}, {obj.powiat}</p>
                                            </section>
                                            <section className="flex flex-col items-center justify-center">
                                                <h1 className="font-bold text-md">Gmina</h1>
                                                <p className="mx-10 text-md">{obj.gmina}</p>
                                            </section>
                                            <section className="flex flex-col items-center justify-center">
                                                <h1 className="font-bold text-md">Nr okręgu podatkowego</h1>
                                                <p className="mx-10 text-md">{obj.okreg_podatkowy || "BRAK"}</p>
                                            </section>
                                            <section className="flex flex-col items-center justify-center">
                                                <h1 className="font-bold text-md">Stawka podatku rolnego</h1>
                                                <p className="mx-10 text-md">{!obj.podatek_rolny ? "BRAK" : obj.podatek_rolny + "zł"}</p>
                                            </section>
                                            <section className="flex flex-col items-center justify-center">
                                                <h1 className="font-bold text-md">Stawka podatku leśnego</h1>
                                                <p className="mx-10 text-md">{!obj.podatek_lesny ? "BRAK" : obj.podatek_lesny + "zł"}</p>
                                            </section>
                                            <section className="flex gap-x-3">
                                                <button className="info-btn" onClick={() => {
                                                    setForm("edit")
                                                    setEditFormData({
                                                        tax_district:obj.okreg_podatkowy,
                                                        agricultural_tax:obj.podatek_rolny || "153.7000",
                                                        forest_tax:obj.podatek_lesny || "153.7000"
                                                    })
                                                    setEditDistrictID(obj.ID)
                                                }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                            </section>
                                        </section>
                                    </section>
                                
                                
                                )
                            }
                        </section>
                    
                    </>
                }
                {
                    form == "edit" &&
                    <>
                        <section className="my-10">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl my-2 text-center">Edycja gminy</h1>
                            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                            <section className="py-2 flex-col items-center">
                                <SelectInput
                                    title="Okręg podatkowy"
                                    value={editFormData.tax_district}
                                    onChange={(e) => setEditFormData(prev => ({...prev, tax_district:e.target.value}))}
                                    placeholder="BRAK"
                                    options={
                                        <>
                                            <option value="1">I</option>
                                            <option value="2">II</option>
                                            <option value="3">III</option>
                                            <option value="4">IV</option>
                                        </>
                                    }
                                />
                                <SimpleInput
                                    type="number"
                                    min="0"
                                    title="Podatek rolny"
                                    step="any"
                                    placeholder="agricultural tax.."
                                    value={editFormData.agricultural_tax}
                                    onChange={(e) => setEditFormData(prev => ({...prev, agricultural_tax:e.target.value}))}
                                    error={editErrors.agricultural_tax}
                                />
                                <SimpleInput
                                    type="number"
                                    min="0"
                                    title="Podatek leśny"
                                    step="any"
                                    placeholder="agricultural tax.."
                                    value={editFormData.forest_tax}
                                    onChange={(e) => setEditFormData(prev => ({...prev, forest_tax:e.target.value}))}
                                    error={editErrors.forest_tax}
                                />
                            </section>
                            <button className="base-btn" onClick={() => {
                                if(Object.keys(editFormData).length == 3) {
                                    if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                        requestEdit();
                                    }
                                    }
                            }}>Zaktualizuj</button>
                        </section>
                    
                    </>
                }
            </section>
        </main>
    )
}