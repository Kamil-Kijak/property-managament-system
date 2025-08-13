
import {useReactToPrint} from "react-to-print"
import SearchBar from "../../components/SearchBar";
import { useRef, useState } from "react";
import { useEffect } from "react";
import {useLocalizations} from "../../hooks/plain/useLocalizations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint} from "@fortawesome/free-solid-svg-icons";
import InsertLand from "../../forms/insert/InsertLand";
import Land from "../../components/Land";
import EditLand from "../../forms/edit/EditLand";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import InsertRent from "../../forms/insert/InsertRent";
import SearchInput from "../../components/inputs/SearchInput"
import SearchSelectInput from "../../components/inputs/SearchSelectInput"
import InsertArea from "../../forms/insert/InsertArea";
import { useForm } from "../../hooks/plain/useForm";
import LandsForPrint from "../../components/LandsForPrint";
import { useApi } from "../../hooks/plain/useApi";
import { useLandsStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditArea from "../../forms/edit/EditArea";

export default function LandsPage({}) {
    const warningUpdate = useWarningStore((state) => state.update);
    const {lands, updateLands, updateID, editID} = useLandsStore();
    const updateForm = useFormStore((state) => state.updateForm);

    const API = useApi();
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
    const [landFiles, setLandFiles] = useState([]);
    const [areaEditID, setAreaEditID] = useState(null);

    const printComponentRef = useRef(null);

    useEffect(() => {
        API.getLandPurposes().then(result => {
            if(!result.error) {
                setLandPurposes(result.data)
            }
        })
        search()
    }, []);

    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
            province_filter: localizations.province,
            district_filter: localizations.district,
            commune_filter: localizations.commune,
            town_filter: localizations.town
        });
        API.getLands(params).then(result => {
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
                updateLands(lands);
                setLandFiles(result.files);
            }
        });
    }
    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteLand({ID_land:ID}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }
    const handlePrintLands = useReactToPrint({
        contentRef: printComponentRef,
        documentTitle:"System SK INVEST"
    })

    return(
        <BasePage requiredRoles={[]}>
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
            <section className="hidden">
                <LandsForPrint ref={printComponentRef} lands={lands}/>
            </section>
            <DisplaySection
                header={
                    <>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {lands.length}</h1>
                        <section className="my-1">
                            <button className="base-btn text-xl" onClick={handlePrintLands}><FontAwesomeIcon icon={faPrint}/> Drukuj wyniki</button>
                        </section>
                    </>
                }
                list={lands}
                template={(obj) =>
                    <Land
                        obj={obj}
                        key={obj.ID}
                        requestDelete={requestDelete}
                        file={landFiles.find((ele) => obj.numer_seryjny_dzialki == ele.replace("-", "/").substring(0, ele.lastIndexOf(".")))}
                        setLandFiles={setLandFiles}
                        editArea={(ID, landID, data) => {updateForm("edit_area"); setAreaEditID(ID); updateID(landID); setEditAreaFormData(data)}}
                        search={search}
                    />
                }
                footer={
                    <>
                        <section className="my-10">
                            <h1 className="text-4xl font-bold text-center">Podsumowanie</h1>
                            <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                            <section className="flex gap-x-7 justify-center">
                                <section className="flex-col gap-y-3">
                                    <h1 className="text-2xl">Suma podatku rolnego: {(lands.reduce((acc, value) => acc + value.powierzchnie.filter((value2) => value2.podatek == "rolny").reduce((acc2, value2) => acc2 + (Number((value2.przelicznik * value2.p_powierzchnia).toFixed(4)) - value2.zwolniona_powierzchnia) * value.podatek_rolny, 0), 0)).toFixed(4)}zł</h1>
                                    <h1 className="text-2xl mt-3">Suma podatku leśnego: {(lands.reduce((acc, value) => acc + value.powierzchnie.filter((value2) => value2.podatek == "leśny").reduce((acc2, value2) => acc2 + (Number((value2.przelicznik * value2.p_powierzchnia).toFixed(4)) - value2.zwolniona_powierzchnia) * value.podatek_lesny, 0), 0)).toFixed(4)}zł</h1>
                                    <h1 className="text-2xl mt-3">Suma ha. fizyczne: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.p_powierzchnia), 0), 0)).toFixed(4)}ha</h1>
                                </section>
                                <section className="flex-col gap-y-3">
                                    <h1 className="text-2xl">Suma ha. przel.: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.p_powierzchnia) * value2.przelicznik, 0), 0)).toFixed(4)}ha</h1>
                                    <h1 className="text-2xl mt-3">Suma ha. zwol.: {(lands.reduce((acc, value) => acc + value.powierzchnie.reduce((acc2, value2) => acc2 + Number(value2.zwolniona_powierzchnia), 0), 0)).toFixed(4)}ha</h1>
                                </section>
                            </section>
                        </section>
                        <button className="base-btn text-2xl" onClick={() => {
                                updateForm("insert")
                            }}><FontAwesomeIcon icon={faPlus}/> Dodaj nową działkę</button>
                    </>
                }
            />
            <InsertLand
                search={search}
            />
            <EditLand
                search={search}
            />
            <InsertRent
                search={search}
            />
            <InsertArea
                search={search}
            />
            <EditArea
                search={search}
                areaID={areaEditID}
                editAreaFormData={editAreaFormData}
                editAreaErrors={editAreaErrors}
                setEditAreaFormData={setEditAreaFormData}
            />
        </BasePage>
    )
}