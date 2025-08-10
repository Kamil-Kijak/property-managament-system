
import NavBar from "../components/NavBar"
import {useReactToPrint} from "react-to-print"
import SearchBar from "../components/SearchBar";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import {useLocalizations} from "../hooks/useLocalizations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import InsertLand from "../forms/InsertLand";
import Land from "../components/Land";
import EditLand from "../forms/EditLand";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import InsertRent from "../forms/InsertRent";
import SearchInput from "../components/inputs/SearchInput"
import SearchSelectInput from "../components/inputs/SearchSelectInput"
import AddArea from "../forms/AddArea";
import { useForm } from "../hooks/useForm";
import SimpleInput from "../components/inputs/SimpleInput";
import SelectInput from "../components/inputs/SelectInput";
import LandsForPrint from "../components/LandsForPrint";
import { useScrollStore } from "../hooks/useScrollStore";

export default function LandsPage({}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);
    const {pixels, updatePixels} = useScrollStore();

    const scrollRef = useRef(null);
    const changedPixels = useRef(0);
    
    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
    const [searchFilters, setSearchFilters] = useState({
        serial_filter:"",
        land_number_filter:"",
        purpose_filter:"",
        rent_filter:"",
        low_area_filter:"",
        high_area_filter:"",
        seller_filter:""
    });
    const [editAreaFormData, editAreaErrors, setEditAreaFormData] = useForm({
        "ID_ground_class":{regexp:/.+/, error:"Wybierz klase gruntu"},
        "area":{regexp:/^\d{0,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "released_area":{regexp:/^(\d{0,4}\.\d{4}|0)$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    })

    const [landPurposes, setLandPurposes] = useState([]);
    const [lands, setLands] = useState([]);
    const [landFiles, setLandFiles] = useState([]);
    const [form, setForm] = useState(null);
    const [editLandID, setEditLandID] = useState();
    const [editAreaID, setEditAreaID] = useState();
    const [groundClasses, setGroundClasses] = useState([]);
    const request = useRequest();

    const printComponentRef = useRef(null);

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

    useEffect(() => {
        if(!form) {
            scrollRef.current.scrollTo({
                behavior:"smooth",
                top:pixels
            })
        } else {
            updatePixels(changedPixels.current)
        }
        if(form == "editArea") {
            loadingUpdate(true);
            const params = new URLSearchParams({
                ID_land:editLandID
            })
            request(`/api/ground_classes/get_land_classes?${params.toString()}`).then(result => {
                if(!result.error) {
                    setGroundClasses(result.data);
                }
                loadingUpdate(false);
            })
        }
    }, [form]);

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
                    const lands = [];
                    result.data.forEach((obj) => {
                        const objToPush = {
                            ID:obj.ID,
                            numer_seryjny_dzialki:obj.numer_seryjny_dzialki,
                            nr_dzialki:obj.nr_dzialki,
                            powierzchnia:obj.powierzchnia,
                            nr_kw:obj.nr_kw,
                            hipoteka:obj.hipoteka,
                            miejscowosc:obj.miejscowosc,
                            wojewodztwo:obj.wojewodztwo,
                            powiat:obj.powiat,
                            gmina:obj.gmina,
                            w_imie:obj.w_imie,
                            w_nazwisko:obj.w_nazwisko,
                            rodzaj:obj.rodzaj,
                            przeznaczenie:obj.przeznaczenie,
                            mpzp:obj.mpzp,
                            plan_ogolny:obj.plan_ogolny,
                            data_nabycia:obj.data_nabycia,
                            nr_aktu:obj.nr_aktu,
                            sprzedawca:obj.sprzedawca,
                            cena_zakupu:obj.cena_zakupu,
                            ID_dzierzawy:obj.ID_dzierzawy,
                            d_imie:obj.d_imie,
                            d_nazwisko:obj.d_nazwisko,
                            opis:obj.opis,
                            spolka_wodna:obj.spolka_wodna,
                            podatek_rolny:obj.podatek_rolny,
                            podatek_lesny:obj.podatek_lesny,
                            w_telefon:obj.w_telefon
                        }
                        if(!lands.some((ele) => ele.ID == obj.ID)) {
                            lands.push({...objToPush, powierzchnie:[]});
                        }
                        delete objToPush.ID;
                        Object.keys(objToPush).forEach(key => delete obj[key]);
                        if(obj.p_ID)
                            lands.find(ele => ele.ID == obj.ID).powierzchnie.push({...obj});
                    })
                    setLands(lands);
                    setLandFiles(result.files);
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
    const requestEditArea = () => {
        loadingUpdate(true);
        request("/api/areas/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_area:editAreaID, ...editAreaFormData})
            }).then(result => {
                if(!result.error) {
                    search();
                    setForm(null);
                }
                loadingUpdate(false);
            })
    }

    const validateForm = () => {
        if(Object.keys(editAreaFormData).length == 3) {
            if(Object.keys(editAreaErrors).every(ele => editAreaErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const handlePrintLands = useReactToPrint({
        contentRef: printComponentRef,
        documentTitle:"System SK INVEST"
    })

    return(
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section ref={scrollRef} className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 pb-5 relative" onScroll={(e) => !form && ( changedPixels.current = e.target.scrollTop)}>
                <section className="hidden">
                    <LandsForPrint ref={printComponentRef} lands={lands}/>
                </section>
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
                        <SearchInput
                            title="Od kogo"
                            placeholder="from whom..."
                            value={searchFilters.seller_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, seller_filter:e.target.value}))}
                        />
                        </>
                    }
                    
                    />
                    <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {lands.length}</h1>
                    <section className="my-1">
                        <button className="base-btn text-xl" onClick={handlePrintLands}><FontAwesomeIcon icon={faPrint}/> Drukuj wyniki</button>
                    </section>
                    <section className="my-2">
                       {
                            lands.map((obj) => {
                                return (<Land
                                    obj={obj}
                                    key={obj.ID}
                                    requestDelete={requestDelete}
                                    addRent={(ID) => {setForm("addRent");setEditLandID(ID)}}
                                    editLand={(ID) => {setForm("edit");setEditLandID(ID)}}
                                    file={landFiles.find((ele) => obj.numer_seryjny_dzialki == ele.replace("-", "/").substring(0, ele.lastIndexOf(".")))}
                                    setLandFiles={setLandFiles}
                                    addArea={(ID) => {setForm("addArea");setEditLandID(ID)}}
                                    editArea={(ID, landID, data) => {setForm("editArea"); setEditAreaID(ID); setEditLandID(landID); setEditAreaFormData(data)}}
                                    search={search}
                                    />)
                            })
                       }
                    </section>
                    <section className="my-10">
                        <h1 className="text-4xl font-bold text-center">Podsumowanie</h1>
                        <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                        <section className="flex gap-x-7 justify-center">
                            <section className="flex-col gap-y-3">
                                <h1 className="text-2xl">Suma podatku: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + (Number((value2.przelicznik * value2.p_powierzchnia).toFixed(4)) - value2.zwolniona_powierzchnia) * (value2.podatek == "zwolniony" ? 0 : value2.podatek == "rolny" ? (value.podatek_rolny || 0) : (value.podatek_lesny || 0)), 0), 0)).toFixed(4)}zł</h1>
                                <h1 className="text-2xl mt-3">Suma ha. fizyczne: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.p_powierzchnia), 0), 0)).toFixed(4)}ha</h1>
                            </section>
                            <section className="flex-col gap-y-3">
                                <h1 className="text-2xl">Suma ha. przel.: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.p_powierzchnia) * value2.przelicznik, 0), 0)).toFixed(4)}ha</h1>
                                <h1 className="text-2xl mt-3">Suma ha. zwol.: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.zwolniona_powierzchnia), 0), 0)).toFixed(4)}ha</h1>
                            </section>
                        </section>
                    </section>
                    <button className="base-btn text-2xl" onClick={() => {
                            setForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nową działkę</button>
                    </>
                }
                {
                    form == "insert" && <InsertLand onClose={() => {setForm(null); search()}}/>
                }
                {
                    form == "edit" && <EditLand onClose={() => {setForm(null); search()}} editLandID={editLandID}/>
                }
                {
                    form == "addRent" && <InsertRent onClose={() => {setForm(null); search()}} landID={editLandID}/>
                }
                {
                    form == "addArea" && <AddArea onClose={() => {setForm(null); search()}} landID={editLandID}/>
                }
                {
                    form == "editArea" &&
                    <>
                    <section className="my-4">
                        <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                    </section>
                        <section className="base-card w-full">
                            <h1 className="text-3xl font-bold">Edycja powierzchni</h1>
                            <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                            <section className="flex justify-center w-full gap-x-5">
                                <section className="w-[150px]">
                                    <SelectInput
                                        title="Klasa gruntu"
                                        value={editAreaFormData.ID_ground_class}
                                        onChange={(e) => setEditAreaFormData(prev => ({...prev, ID_ground_class:e.target.value}))}
                                        options={
                                            <>
                                                {
                                                    groundClasses.map((ele, index) => <option key={index} value={ele.ID}>{ele.klasa} {ele.przelicznik}</option>)
                                                }
                                            </>
                                        }
                                    />
                                </section>
                            </section>
                            <section className="flex justify-center w-full gap-x-5">
                                <SimpleInput
                                    type="number"
                                    min={0}
                                    step="any"
                                    title="Powierzchnia"
                                    placeholder="area..."
                                    value={editAreaFormData.area}
                                    onChange={(e) => setEditAreaFormData(prev => ({...prev, area:e.target.value}))}
                                    error={editAreaErrors.area}
                                />
                                <SimpleInput
                                    type="number"
                                    min={0}
                                    step="any"
                                    title="Zwolnione ha. przeliczeniowe"
                                    placeholder="released area..."
                                    value={editAreaFormData.released_area}
                                    onChange={(e) => setEditAreaFormData(prev => ({...prev, released_area:e.target.value}))}
                                    error={editAreaErrors.released_area}
                                />
                            </section>
                            <button className={validateForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                                if(validateForm()) {
                                    requestEditArea();
                                }
                            }}>Zaktualizuj</button>
                        </section>
                    </>
                }
            </section>
        </main>
    )
}