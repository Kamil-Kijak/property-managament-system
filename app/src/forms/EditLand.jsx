import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalizations } from "../hooks/useLocalizations";
import {useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SelectInput from "../components/inputs/SelectInput";
import SimpleTextArea from "../components/inputs/SimpleTextArea";

export default function EditLand({onClose = () => {}, editLandID = 0}) {

    const updateLoading = useLoadingStore((state) => state.update)

    const [ownerFormData, ownerErrors, setOwnerFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "phone":{regexp:/^[0-9]{1,15}$/, error:"Telefon musi się mieścić w 15 cyfrach"},
    })

    const [landFormData, landErrors, setLandFormData] = useForm({
            "land_serial_number":{regexp:/^\d+_\d\.\d{4}\.(?:\d+|\d+\/\d+)$/, error:"Zły format serialu działki"},
            "land_number":{regexp:/^(?:\d+|\d+\/\d+)$/, error:"Zły format numeru działki"},
            "area":{regexp:/^\d{0,4}\.\d{4}$/, error:"Powierzchnia musi być liczbą z 4 miejscami po przecinku poniżej 10000"},
            "kw_number":{regexp:/^[A-Za-z]{2}\d[A-Za-z]\/\d{8}\/\d$/, error:"numer księgi wieczystej musi mieć format 2Litery1Cyfra1Litera/8Cyfr/1Cyfra"},
            "ID_owner":{regexp:/.+/, error:"Wybierz właściciela"},
            "ID_type":{regexp:/.+/, error:"Wybierz rodzaj działki"},
            "ID_purpose":{regexp:/.+/, error:"Wybierz przeznaczenie działki"},
            "ID_mpzp":{regexp:/.+/, error:"Wybierz MPZP"},
            "ID_general_plan":{regexp:/.+/, error:"Wybierz plan ogólny"},
            "mortgage":{regexp:/.+/, error:"Czy ma kartoteke?"},
            "description":{regexp:/^.{0,1000}$/, error:"Opis musi się mieścić w 1000 znaków"},
            "water_company":{regexp:/.+/, error:"Czy jest spółką wodną"},
            "purchase_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Podaj date w dobrym formacie"},
            "case_number":{regexp:/^\d+\/\d+$/, error:"Numer aktu musi być w formacie cyfry/cyfry"},
            "seller":{regexp:/^.{1,49}$/, error:"Sprzedawca musi się mieścić w 50 znakach"},
            "price":{regexp:/^\d+\.\d{2}$/, error:"Cena musi być liczbą z 2 miejscami po przecinku"},
        })
    
        const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
        const [selectData, setSelectData] = useState({
            owners:[],
            land_types:[],
            land_purposes:[],
            general_plans:[],
            mpzp:[]
        })
        const request = useRequest();
        const fetchAllData = async () => {
            updateLoading(true)
            const landSelectData = await request("/api/lands/get_insertion_required_data", {credentials:"include"});
            if(!landSelectData.error) {
                setSelectData({...landSelectData.data})
            }
            const actualLandData = await request(`/api/lands/get_land?ID_land=${editLandID}`, {credentials:"include"});
            if(!actualLandData.error) {
                setLocalizations({town:actualLandData.data.miejscowosc, commune:actualLandData.data.gmina, district:actualLandData.data.powiat, province:actualLandData.data.wojewodztwo})
                const objectsToDelete = ["miejscowosc", "gmina", "powiat", "wojewodztwo"]
                objectsToDelete.forEach(obj => delete actualLandData[obj]);
                console.log(actualLandData.data.powierzchnia)
                setLandFormData({
                    land_serial_number:actualLandData.data.numer_seryjny_dzialki,
                    land_number:actualLandData.data.nr_dzialki,
                    area:actualLandData.data.powierzchnia,
                    kw_number:actualLandData.data.nr_kw,
                    ID_owner:actualLandData.data.w_ID,
                    ID_type:actualLandData.data.rodzaj,
                    ID_purpose:actualLandData.data.przeznaczenie,
                    ID_mpzp:actualLandData.data.mpzp,
                    ID_general_plan:actualLandData.data.plan_ogolny,
                    mortgage:actualLandData.data.hipoteka,
                    description:actualLandData.data.opis,
                    water_company:actualLandData.data.spolka_wodna,
                    purchase_date:actualLandData.data.data_nabycia.split('T')[0],
                    seller:actualLandData.data.sprzedawca,
                    price:actualLandData.data.cena_zakupu,
                    case_number:actualLandData.data.nr_aktu
                });
            }
            updateLoading(false);
        }
        
        useEffect(() => {
            fetchAllData();
        }, []);

        const requestInsertOwner = async () => {
            updateLoading(true);
            const result = await request("/api/owners/insert", {
                        method:"POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body:JSON.stringify({...ownerFormData})
                    })
            if(!result.error) {
                await fetchAllData();
                setOwnerFormData({});
                setLandFormData(prev => ({...prev, ID_owner:result.insertID}));
            }
            updateLoading(false);
        }

        const requestEditLand = async () => {
            updateLoading(true);
            const result = await request("/api/lands/update", {
                        method:"POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body:JSON.stringify({...landFormData, ...localizations, ID_land:editLandID})
                    })
            if(!result.error) {
                onClose();
            }
            updateLoading(false);
    }

    return (
        <>
            <section className="my-4">
                <button className="base-btn text-2xl" onClick={onClose}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card w-full">
                <h1 className="text-3xl font-bold">Aktualizacja działki</h1>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <SimpleInput
                    title="Numer seryjny działki (ID)"
                    placeholder="serial numer (ID)..."
                    value={landFormData.land_serial_number}
                    onChange={(e) => setLandFormData(prev => ({...prev, land_serial_number:e.target.value}))}
                />
                <p className="error-text">{landErrors.land_serial_number}</p>
                <section className="flex justify-center w-full gap-x-5">
                    <SimpleInput
                        title="Numer działki"
                        placeholder="land number..."
                        value={landFormData.land_number}
                        onChange={(e) => setLandFormData(prev => ({...prev, land_number:e.target.value}))}
                    />
                    <SimpleInput
                        type="number"
                        step="any"
                        min={0}
                        title="Powierzchnia działki (ha)"
                        placeholder="land area (ha)..."
                        value={landFormData.area}
                        onChange={(e) => setLandFormData(prev => ({...prev, area:e.target.value}))}
                    />
                </section>
                <p className="error-text">{landErrors.land_number}</p>
                <p className="error-text">{landErrors.area}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-5 my-5">
                    <section className="w-[150px]">
                        <SelectInput
                            title="Województwo"
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
                        <SelectInput
                            title="Powiat"
                            value={localizations.district}
                            onChange={(e) => setLocalizations(prev => ({...prev, commune:"", town:"", district:e.target.value}))}
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
                        <SelectInput
                            title="Gmina"
                            value={localizations.commune}
                            onChange={(e) => setLocalizations(prev => ({...prev, town:"", commune:e.target.value}))}
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
                        <SelectInput
                            title="Miejscowość"
                            value={localizations.town}
                            onChange={(e) => setLocalizations(prev => ({...prev, town:e.target.value}))}
                            options={
                                <>
                                    {
                                        availableLocalizations.towns.map((obj) => <option key={obj} value={obj}>{obj}</option>)
                                    }
                                </>
                            }
                        
                        />
                    </section>
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <section className="w-[150px]">
                        <SelectInput
                            title="Właściciel"
                            value={landFormData.ID_owner}
                            onChange={(e) => setLandFormData(prev => ({...prev, ID_owner:e.target.value}))}
                            options={
                                <>
                                    {
                                        selectData.owners.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} {obj.telefon}</option>)
                                    }
                                </>
                            }
                        />
                    </section>
                    <section className="base-card">
                        <h1 className="text-2xl font-bold">Tworzenie nowego właściciela</h1>
                        <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                        <SimpleInput
                            title="Imie"
                            placeholder="name..."
                            value={ownerFormData.name}
                            onChange={(e) => setOwnerFormData(prev => ({...prev, name:e.target.value}))}
                        />
                        <SimpleInput
                            title="Nazwisko"
                            placeholder="surname..."
                            value={ownerFormData.surname}
                            onChange={(e) => setOwnerFormData(prev => ({...prev, surname:e.target.value}))}
                        />
                        <SimpleInput
                            title="Telefon"
                            placeholder="phone..."
                            value={ownerFormData.phone}
                            onChange={(e) => setOwnerFormData(prev => ({...prev, phone:e.target.value}))}
                        />
                        <p className="error-text">{ownerErrors[Object.keys(ownerErrors).find(ele => ownerErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(ownerFormData).length == 3) {
                                if(Object.keys(ownerErrors).every(ele => ownerErrors[ele] == null)) {
                                    requestInsertOwner();
                                }
                            }
                        }}>Stwórz właścicela</button>
                    </section>
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <SimpleInput
                        title="Numer księgi wieczystej"
                        placeholder="land register number..."
                        value={landFormData.kw_number}
                        onChange={(e) => setLandFormData(prev => ({...prev, kw_number:e.target.value}))}
                    />
                    <SelectInput
                        title="Hipoteka"
                        value={landFormData.mortgage}
                        onChange={(e) => setLandFormData(prev => ({...prev, mortgage:e.target.value}))}
                        options={
                            <>
                                <option value="1">TAK</option>
                                <option value="0">NIE</option>
                            </>
                        }
                    />
                </section>
                <p className="error-text">{landErrors.kw_number}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                   <SelectInput
                        title="Rodzaj działki"
                        value={landFormData.ID_type}
                        onChange={(e) => setLandFormData(prev => ({...prev, ID_type:e.target.value}))}
                        options={
                            <>
                                {
                                    selectData.land_types.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwa}</option>)
                                }
                            </>
                        }
                    />
                    <SelectInput
                        title="Przeznaczenie działki"
                        value={landFormData.ID_purpose}
                        onChange={(e) => setLandFormData(prev => ({...prev, ID_purpose:e.target.value}))}
                        options={
                            <>
                                {
                                    selectData.land_purposes.map((obj, index) => <option key={index} value={obj.ID}>{obj.typ}</option>)
                                }
                            </>
                        }
                    />
                    <SelectInput
                        title="Plan ogólny"
                        value={landFormData.ID_general_plan}
                        onChange={(e) => setLandFormData(prev => ({...prev, ID_general_plan:e.target.value}))}
                        options={
                            <>
                                {
                                    selectData.general_plans.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                                }
                            </>
                        }
                    />
                    <SelectInput
                        title="MPZP"
                        value={landFormData.ID_mpzp}
                        onChange={(e) => setLandFormData(prev => ({...prev, ID_mpzp:e.target.value}))}
                        options={
                            <>
                                {
                                    selectData.mpzp.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                                }
                            </>
                        }
                    />
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <SimpleTextArea
                        title="Opis działki"
                        placeholder="land description..."
                        value={landFormData.description}
                        onChange={(e) => setLandFormData(prev => ({...prev, description:e.target.value}))}
                    
                    />
                    <SelectInput
                        title="Spółka wodna"
                        value={landFormData.water_company}
                        onChange={(e) => setLandFormData(prev => ({...prev, water_company:e.target.value}))}
                        options={
                            <>
                                <option value="1">TAK</option>
                                <option value="0">NIE</option>
                            </>
                        }
                    />
                </section>
                <p className="error-text">{landErrors.description}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <SimpleInput
                        type="date"
                        title="Data zakupu"
                        placeholder="purchase date..."
                        value={landFormData.purchase_date}
                        onChange={(e) => setLandFormData(prev => ({...prev, purchase_date:e.target.value}))}
                    />
                    <SimpleInput
                        title="Numer aktu"
                        placeholder="case number..."
                        value={landFormData.case_number}
                        onChange={(e) => setLandFormData(prev => ({...prev, case_number:e.target.value}))}
                    />
                    <SimpleInput
                        title="Sprzedawca (od kogo)"
                        placeholder="seller (from whom)..."
                        value={landFormData.seller}
                        onChange={(e) => setLandFormData(prev => ({...prev, seller:e.target.value}))}
                    />
                    <SimpleInput
                        type="number"
                        step="any"
                        min={0}
                        title="Cena zakupu (PLN)"
                        placeholder="purchase cost (PLN)..."
                        value={landFormData.price}
                        onChange={(e) => setLandFormData(prev => ({...prev, price:e.target.value}))}
                    />
                </section>
                <p className="error-text">{landErrors.purchase_date}</p>
                <p className="error-text">{landErrors.case_number}</p>
                <p className="error-text">{landErrors.seller}</p>
                <p className="error-text">{landErrors.price}</p>
                <button className="base-btn text-2xl" onClick={() => {
                    if(Object.keys(landFormData).length == 16) {
                        if(Object.keys(landErrors).every(ele => landErrors[ele] == null)) {
                            if(Object.keys(localizations).every(ele => localizations[ele].length != 0)) {
                                requestEditLand();
                            }
                        }  
                    }
                }}>Zaktualizuj</button>
            </section>
        </>
    )
}