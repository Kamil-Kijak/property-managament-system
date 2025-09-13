import { useEffect, useRef, useState } from "react";
import SearchSelectInput from "../../components/inputs/SearchSelectInput";
import SearchBar from "../../components/SearchBar";
import { useLocalizations } from "../../hooks/plain/useLocalizations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../hooks/plain/useForm";
import { useDistrictsStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditDistrict from "../../forms/edit/EditDistrict";
import { useApi } from "../../hooks/plain/useApi";
import SearchInput from "../../components/inputs/SearchInput";


export default function DistrictsPage({}) {

    const {districts, updateDistricts, updateID} = useDistrictsStore();
    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
    const updateForm = useFormStore((state) => state.updateForm);
    const API = useApi();

    const limitDisplayRef = useRef(null);

    const [editFormData, editErrors, setEditFormData] = useForm({
        "tax_district":{regexp:/\d+/, error:"Wybierz okręg"},
        "agricultural_tax":{regexp:/^\d{1,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "forest_tax":{regexp:/^\d{1,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    });

    const [searchFilters, setSearchFilters] = useState({
        tax_district:"",
        agricultural_tax:"",
        forest_tax:"",
        limit:"200"
    })

    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
            ...localizations
        });
        API.getDistricts(params).then(result => {
            if(!result.error) {
                updateDistricts(result.data);
                limitDisplayRef.current.innerHTML = `Limit wyników: ${searchFilters.limit || "NIEOGRANICZONY"}`
            }
        });
    }

    useEffect(() => {
        search()
    }, []);

    return (
        <BasePage requiredRoles={["KSIEGOWOSC", "SEKRETARIAT"]}>
            <SearchBar
                onSearch={search}
                elements={
                    <>
                        <SearchInput
                            type="number"
                            min={0}
                            placeholder="results limit..."
                            title="limit wyników"
                            onChange={(e) => setSearchFilters(prev => ({...prev, limit:e.target.value}))}
                            value={searchFilters.limit}
                        />
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
            <DisplaySection
                header={
                    <>
                        <h1 ref={limitDisplayRef} className="font-bold text-lg mt-5">Limit wyników: {searchFilters.limit || "NIEOGRANICZONY"}</h1>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {districts.length}</h1>
                    </>
                }
                list={districts}
                template={(obj) => 
                    <section className="base-card my-5" key={obj.ID}>
                        <section className="flex gap-x-5 items-center">
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-md text-center">Lokalizacja</h1>
                                <p className="mx-10 text-md text-center whitespace-nowrap">{obj.wojewodztwo}, {obj.powiat}</p>
                            </section>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-md text-center">Gmina</h1>
                                <p className="mx-10 text-md text-center">{obj.gmina}</p>
                            </section>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-md text-center">Nr okręgu podatkowego</h1>
                                <p className="mx-10 text-md text-center">{obj.okreg_podatkowy || "BRAK"}</p>
                            </section>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-md text-center">Stawka podatku rolnego</h1>
                                <p className="mx-10 text-md text-center">{!obj.podatek_rolny ? "BRAK" : obj.podatek_rolny + "zł"}</p>
                            </section>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-md text-center">Stawka podatku leśnego</h1>
                                <p className="mx-10 text-md text-center">{!obj.podatek_lesny ? "BRAK" : obj.podatek_lesny + "zł"}</p>
                            </section>
                            <section className="flex gap-x-3">
                                <button className="info-btn" onClick={() => {
                                    updateForm("edit");
                                    setEditFormData({
                                        tax_district:obj.okreg_podatkowy,
                                        agricultural_tax:obj.podatek_rolny || "153.7000",
                                        forest_tax:obj.podatek_lesny || "153.7000"
                                    })
                                    updateID(obj.ID)
                                }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                            </section>
                        </section>
                    </section>
                }
            />
            <EditDistrict
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
                search={search}
            />
        </BasePage>
    )
}