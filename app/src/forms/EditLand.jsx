import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalizations } from "../hooks/useLocalizations";
import { useContext, useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { screenContext } from "../App";
import { useForm } from "../hooks/useForm";

export default function EditLand({onClose = () => {}, editLandID = 0}) {

    const screens = useContext(screenContext);

    const ownerSelectRef = useRef(null);
    const ownerInputRefs = useRef({});
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
            screens.loading.set(true);
            const landSelectData = await request("/api/lands/get_insertion_required_data", {credentials:"include"});
            if(!landSelectData.error) {
                setSelectData({...landSelectData.data})
            }
            const actualLandData = await request(`/api/lands/get_land?ID_land=${editLandID}`, {credentials:"include"});
            if(!actualLandData.error) {
                setLocalizations({town:actualLandData.data.miejscowosc, commune:actualLandData.data.gmina, district:actualLandData.data.powiat, province:actualLandData.data.wojewodztwo})
                const objectsToDelete = ["miejscowosc", "gmina", "powiat", "wojewodztwo"]
                objectsToDelete.forEach(obj => delete actualLandData[obj]);
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
            screens.loading.set(false);
        }
        
        useEffect(() => {
            fetchAllData();
        }, []);

        const requestInsertOwner = async () => {
            screens.loading.set(true);
            const result = await request("/api/owners/insert", {
                        method:"POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body:JSON.stringify({...ownerFormData})
                    })
            if(!result.error) {
                await fetchAllData();
                ownerSelectRef.current.value = result.insertID;
                setOwnerFormData({});
                ownerInputRefs.current["name"].value = ""
                ownerInputRefs.current["surname"].value = ""
                ownerInputRefs.current["phone"].value = ""
            }
        }

        const requestEditLand = async () => {
            screens.loading.set(true);
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
            screens.loading.set(false);
    }

    return (
        <>
            <section className="my-4">
                <button className="base-btn text-2xl" onClick={onClose}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card w-full">
                <h1 className="text-3xl font-bold">Aktualizacja działki</h1>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex flex-col items-start my-2">
                    <h1 className="font-bold mb-1">Numer seryjny działki (ID)</h1>
                    <input type="text" placeholder="serial number (ID)..." className="border-2 border-black p-1 rounded-md w-[300px]" value={landFormData.land_serial_number || ""} onChange={(e) => setLandFormData(prev => ({...prev, land_serial_number:e.target.value}))} />
                </section>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.land_serial_number}</p>
                <section className="flex justify-center w-full gap-x-5">
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Numer działki</h1>
                        <input type="text" placeholder="land number..." className="border-2 border-black p-1 rounded-md" value={landFormData.land_number || ""} onChange={(e) => setLandFormData(prev => ({...prev, land_number:e.target.value}))}/>
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Powierzchnia działki (ha)</h1>
                        <input type="number" placeholder="land area (ha)..." className="border-2 border-black p-1 rounded-md" value={landFormData.area ?? ""} min={0} onChange={(e) => setLandFormData(prev => ({...prev, area:e.target.value}))}/>
                    </section>
                </section>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.land_number}</p>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.area}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-5 my-5">
                    <section className="ml-1 w-[150px]">
                            <h1 className="font-bold">Województwo</h1>
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={localizations.province || ""} onChange={(e) => setLocalizations({district:"", commune:"", town:"", province:e.target.value})}>
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
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={localizations.district || ""}  onChange={(e) => setLocalizations(prev => ({...prev, district:e.target.value, commune:"", town:"",}))}>
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
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={localizations.commune || ""} onChange={(e) => setLocalizations(prev => ({...prev, commune:e.target.value, town:"",}))}>
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
                            <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={localizations.town || ""} onChange={(e) => setLocalizations(prev => ({...prev, town:e.target.value,}))}>
                                <option value="" className="hidden">Wybierz</option>
                                {
                                    availableLocalizations.towns.map((obj) => {
                                        return <option key={obj} value={obj}>{obj}</option>
                                    })
                                }
                            </select>
                        </section>
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <section className="ml-1 w-[150px]">
                        <h1 className="font-bold">Właściciel</h1>
                        <select ref={ownerSelectRef} className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={landFormData.ID_owner ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, ID_owner:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                selectData.owners.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} {obj.telefon}</option>)
                            }
                        </select>
                    </section>
                    <section className="base-card">
                        <h1 className="text-2xl font-bold">Tworzenie nowego właściciela</h1>
                        <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Imie</h1>
                            <input ref={(el) => ownerInputRefs.current["name"] = el} type="text" placeholder="name..." className="border-2 border-black p-1 rounded-md" onChange={(e) => setOwnerFormData(prev => ({...prev, name:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Nazwisko</h1>
                            <input ref={(el) => ownerInputRefs.current["surname"] = el} type="text" placeholder="surname..." className="border-2 border-black p-1 rounded-md" onChange={(e) => setOwnerFormData(prev => ({...prev, surname:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Telefon</h1>
                            <input ref={(el) => ownerInputRefs.current["phone"] = el} type="phone" placeholder="phone..." className="border-2 border-black p-1 rounded-md" onChange={(e) => setOwnerFormData(prev => ({...prev, phone:e.target.value}))} />
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{ownerErrors[Object.keys(ownerErrors).find(ele => ownerErrors[ele] != null)]}</p>
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
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Numer księgi wieczystej</h1>
                        <input type="text" placeholder="land register number..." className="border-2 border-black p-1 rounded-md w-[300px]" value={landFormData.kw_number || ""} onChange={(e) => setLandFormData(prev => ({...prev, kw_number:e.target.value}))} />
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Hipoteka</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={landFormData.mortgage ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, mortgage:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            <option value="1">TAK</option>
                            <option value="0">NIE</option>
                        </select>
                    </section>
                </section>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.kw_number}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <section className="ml-1">
                        <h1 className="font-bold">Rodzaj działki</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full"  value={landFormData.ID_type ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, ID_type:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                selectData.land_types.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwa}</option>)
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Przeznaczenie działki</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={landFormData.ID_purpose ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, ID_purpose:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                selectData.land_purposes.map((obj, index) => <option key={index} value={obj.ID}>{obj.typ}</option>)
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Plan ogólny</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={landFormData.ID_general_plan ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, ID_general_plan:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                selectData.general_plans.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                            }
                        </select>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">MPZP</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full" value={landFormData.ID_mpzp ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, ID_mpzp:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            {
                                selectData.mpzp.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                            }
                        </select>
                    </section>
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Opis działki</h1>
                        <textarea type="text" placeholder="land description..." value={landFormData.description || ""} className="border-2 border-black p-1 rounded-md resize-none w-full h-[7rem]" onChange={(e) => setLandFormData(prev => ({...prev, description:e.target.value}))}></textarea>
                    </section>
                    <section className="ml-1">
                        <h1 className="font-bold">Spółka wodna</h1>
                        <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-full"  value={landFormData.water_company ?? ""} onChange={(e) => setLandFormData(prev => ({...prev, water_company:e.target.value}))}>
                            <option value="" className="hidden">Wybierz</option>
                            <option value="1">TAK</option>
                            <option value="0">NIE</option>
                        </select>
                    </section>
                </section>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.description}</p>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Data zakupu</h1>
                        <input type="date" placeholder="purchase date..." value={landFormData.purchase_date || ""} className="border-2 border-black p-1 rounded-md" onChange={(e) => setLandFormData(prev => ({...prev, purchase_date:e.target.value}))} />
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Numer aktu</h1>
                        <input type="text" placeholder="case number..." value={landFormData.case_number || ""} className="border-2 border-black p-1 rounded-md" onChange={(e) => setLandFormData(prev => ({...prev, case_number:e.target.value}))} />
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Sprzedawca (od kogo)</h1>
                        <input type="text" placeholder="seller (from whom)..." value={landFormData.seller || ""} className="border-2 border-black p-1 rounded-md" onChange={(e) => setLandFormData(prev => ({...prev, seller:e.target.value}))} />
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Cena zakupu (PLN)</h1>
                        <input type="number" placeholder="purhase date (PLN)..." value={landFormData.price || ""} className="border-2 border-black p-1 rounded-md" min={0} onChange={(e) => setLandFormData(prev => ({...prev, price:e.target.value}))} />
                    </section>
                </section>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.purchase_date}</p>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.case_number}</p>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.seller}</p>
                <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{landErrors.price}</p>
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