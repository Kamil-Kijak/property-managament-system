
import { useLocalizations } from "../../hooks/plain/useLocalizations";
import {useEffect, useState } from "react";
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleTextArea from "../../components/inputs/SimpleTextArea";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useLandsStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";
import InsertSection from "../../pages/sections/InsertSection";

export default function EditLand({search}) {

    const editID = useLandsStore((state) => state.editID)
    const {form, updateForm} = useFormStore();
    const API = useApi();

    const [ownerFormData, ownerErrors, setOwnerFormData] = useForm({
        "personal_data":{regexp:/^.{1,100}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^([0-9]{9})?$/, error:"Nie ma 9 cyfr", optional:true},
    })
    const [landFormData, landErrors, setLandFormData] = useForm({
        "land_serial_number":{regexp:/^(?:\d+_\d\.\d{4}\.(?:\d+|\d+\/\d+))?$/, error:"Zły format", optional:true},
        "land_number":{regexp:/^(?:\d+|\d+\/\d+)$/, error:"Zły format"},
        "area":{regexp:/^\d{0,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "kw_number":{regexp:/^([A-Za-z]{2}\d[A-Za-z]\/\d{8}\/\d)?$/, error:"Zły format", optional:true},
        "ID_owner":{regexp:/.+/, error:"Wybierz właściciela"},
        "ID_type":{regexp:/^.*$/, error:"Wybierz rodzaj działki", optional:true},
        "ID_purpose":{regexp:/^.*$/, error:"Wybierz przeznaczenie działki", optional:true},
        "ID_mpzp":{regexp:/^.*$/, error:"Wybierz MPZP", optional:true},
        "ID_general_plan":{regexp:/^.*$/, error:"Wybierz plan ogólny", optional:true},
        "mortgage":{regexp:/.+/, error:"Czy ma hipoteke?"},
        "description":{regexp:/^.{0,1000}$/, error:"Za długi", optional:true},
        "water_company":{regexp:/.+/, error:"Czy jest spółką wodną"},
        "purchase_date":{regexp:/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))?$/, error:"Zły format", optional:true},
        "sell_date":{regexp:/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))?$/, error:"Zły format", optional:true},
        "case_number":{regexp:/^(\d+\/\d+)?$/, error:"Zły format", optional:true},
        "seller":{regexp:/^(.{0,49})?$/, error:"Za długi", optional:true},
        "price":{regexp:/^(\d{0,6}\.\d{2})?$/, error:"Nie ma 2 cyfr po , lub za duża liczba", optional:true},
        "property_tax":{regexp:/^.*$/, error:"czy podlega podatkowi od nieruchomości?"}
    })
    
    const [availableLocalizations, localizations, setLocalizations, matchedTowns] = useLocalizations();

    const [selectData, setSelectData] = useState({
        owners:[],
        land_types:[],
        land_purposes:[],
        general_plans:[],
        mpzp:[]
    })
    const fetchAllData = async () => {
        const landSelectData = await API.getInsertionRequiredData();
        if(!landSelectData.error) {
            setSelectData({...landSelectData.data})
        }
        const actualLandData = await API.getLand(editID);
        if(!actualLandData.error) {
            setLocalizations({town:actualLandData.data.miejscowosc, commune:actualLandData.data.gmina, district:actualLandData.data.powiat, province:actualLandData.data.wojewodztwo})
            const objectsToDelete = ["miejscowosc", "gmina", "powiat", "wojewodztwo"]
            objectsToDelete.forEach(obj => delete actualLandData[obj]);
            const purchase_date = actualLandData.data.data_nabycia ? new Date(actualLandData.data.data_nabycia).toLocaleDateString("sv-SE") : ""
            const sell_date = actualLandData.data.data_sprzedazy ? new Date(actualLandData.data.data_sprzedazy).toLocaleDateString("sv-SE") : ""
            setLandFormData({
                land_serial_number:actualLandData.data.numer_seryjny_dzialki,
                land_number:actualLandData.data.nr_dzialki,
                area:actualLandData.data.powierzchnia,
                kw_number:actualLandData.data.nr_kw,
                ID_owner:actualLandData.data.w_ID,
                ID_type:actualLandData.data.rodzaj || "",
                ID_purpose:actualLandData.data.przeznaczenie || "",
                ID_mpzp:actualLandData.data.mpzp || "",
                ID_general_plan:actualLandData.data.plan_ogolny || "",
                mortgage:actualLandData.data.hipoteka || "0",
                property_tax:actualLandData.data.podlega_podatkowi_nieruchomosci || "0",
                description:actualLandData.data.opis,
                water_company:actualLandData.data.spolka_wodna || "0",
                purchase_date:purchase_date,
                sell_date:sell_date,
                seller:actualLandData.data.sprzedawca,
                price:actualLandData.data.cena_zakupu || "",
                case_number:actualLandData.data.nr_aktu
            });
        }
    }
        
    useEffect(() => {
        if(form == "edit")
            fetchAllData();
    }, [form]);

    const requestInsertOwner = () => {
        API.insertOwner({...ownerFormData}).then(result => {
            if(!result.error) {
                fetchAllData();
                setOwnerFormData({});
                setLandFormData(prev => ({...prev, ID_owner:result.insertID}));
            }
        })
    }

    const requestEditLand = async () => {
        API.updateLand({...landFormData, ...localizations, ID_land:editID}).then(result => {
            if(!result.error) {
                updateForm(null);
                search();
            }
        })
    }

    const validateOwnerForm = () => {
        if(Object.keys(ownerFormData).length == 2) {
            if(Object.keys(ownerErrors).every(ele => ownerErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }
    const validateForm = () => {
        if(Object.keys(landFormData).length == 18) {
            if(Object.keys(landErrors).every(ele => landErrors[ele] == null)) {
                if(Object.keys(localizations).every(ele => localizations[ele].length != 0)) {
                    return true;
                }
            }  
        }
        return false;
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja działki"
            validateForm={validateForm}
            onSubmit={requestEditLand}
            fields={
                <>
                    <SimpleInput
                        title="ID działki"
                        placeholder="land ID..."
                        value={landFormData.land_serial_number}
                        onChange={(e) => setLandFormData(prev => ({...prev, land_serial_number:e.target.value}))}
                        error={landErrors.land_serial_number}
                    />
                    <section className="flex justify-center w-full gap-x-5">
                        <SimpleInput
                            title="Numer działki"
                            placeholder="land number..."
                            value={landFormData.land_number}
                            onChange={(e) => setLandFormData(prev => ({...prev, land_number:e.target.value}))}
                            error={landErrors.land_number}
                        />
                        <SimpleInput
                            type="number"
                            step="any"
                            min={0}
                            title="Powierzchnia działki (ha)"
                            placeholder="land area (ha)..."
                            value={landFormData.area}
                            onChange={(e) => setLandFormData(prev => ({...prev, area:e.target.value}))}
                            error={landErrors.area}
                        />
                    </section>
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
                    </section>
                    <section className="flex justify-center w-full gap-x-5 my-5">
                        <SimpleInput
                            title="Miejscowość"
                            placeholder="town..."
                            value={localizations.town}
                            onChange={(e) => setLocalizations(prev => ({...prev, town:e.target.value}))}
                        />
                        {
                            matchedTowns.length > 0 &&
                            <select multiple={true} className="border-3 rounded-lg p-3 gap-y-2" onChange={(e) => {
                                const data = e.target.value.split(",");
                                setLocalizations({town:data[0], commune:data[1], district:data[2], province:data[3]})
                            }}>
                                {
                                    matchedTowns.map(obj => <option key={obj.ID} value={`${obj.nazwa},${obj.gmina},${obj.powiat},${obj.wojewodztwo}`}>
                                    {obj.nazwa}, {obj.gmina}, {obj.powiat}, {obj.wojewodztwo}
                                    </option>)
                                }
                            </select>
                        }
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <section className="w-[200px]">
                            <SelectInput
                                title="Właściciel"
                                value={landFormData.ID_owner}
                                onChange={(e) => setLandFormData(prev => ({...prev, ID_owner:e.target.value}))}
                                options={
                                    <>
                                        {
                                            selectData.owners.map((obj, index) => <option key={index} value={obj.ID}>{obj.dane_osobowe} tel:{obj.telefon || "BRAK"}</option>)
                                        }
                                    </>
                                }
                            
                            />
                        </section>
                        <InsertSection
                            showClose={false}
                            title="Tworzenie nowego właściciela"
                            validateForm={validateOwnerForm}
                            onSubmit={requestInsertOwner}
                            fields={
                                <>
                                    <SimpleInput
                                        title="Dane"
                                        placeholder="data..."
                                        value={ownerFormData.personal_data}
                                        onChange={(e) => setOwnerFormData(prev => ({...prev, personal_data:e.target.value}))}
                                        error={ownerErrors.personal_data}
                                    />
                                    <SimpleInput
                                        title="Telefon (opcjonalnie)"
                                        placeholder="phone..."
                                        value={ownerFormData.phone}
                                        onChange={(e) => setOwnerFormData(prev => ({...prev, phone:e.target.value}))}
                                        error={ownerErrors.phone}
                                    />
                                </>
                            }
                        />
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SimpleInput
                            title="Numer księgi wieczystej"
                            placeholder="land register number..."
                            value={landFormData.kw_number}
                            onChange={(e) => setLandFormData(prev => ({...prev, kw_number:e.target.value}))}
                            error={landErrors.kw_number}
                        />
                        <SelectInput
                            title="Hipoteka"
                            onChange={(e) => setLandFormData(prev => ({...prev, mortgage:e.target.value}))}
                            value={landFormData.mortgage}
                            options={
                                <>
                                    <option value="1">TAK</option>
                                    <option value="0">NIE</option>
                                </>
                            }
                        />
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SelectInput
                            title="Podlega podatkowi od nieruchomości"
                            onChange={(e) => setLandFormData(prev => ({...prev, property_tax:e.target.value}))}
                            value={landFormData.property_tax}
                            options={
                                <>
                                    <option value="1">TAK</option>
                                    <option value="0">NIE</option>
                                
                                </>
                            }
                        />
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SelectInput
                            title="Rodzaj działki"
                            placeholder=""
                            value={landFormData.ID_type}
                            onChange={(e) => setLandFormData(prev => ({...prev, ID_type:e.target.value}))}
                            options={
                                <>
                                    <option value="">BRAK</option>
                                    {
                                        selectData.land_types.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwa}</option>)
                                    }
                                </>
                            }
                        />
                        <SelectInput
                            title="Przeznaczenie działki"
                            placeholder=""
                            value={landFormData.ID_purpose}
                            onChange={(e) => setLandFormData(prev => ({...prev, ID_purpose:e.target.value}))}
                            options={
                                <>
                                    <option value="">BRAK</option>
                                    {
                                        selectData.land_purposes.map((obj, index) => <option key={index} value={obj.ID}>{obj.typ}</option>)
                                    }
                                </>
                            }
                        />
                        <SelectInput
                            title="Plan ogólny"
                            placeholder=""
                            value={landFormData.ID_general_plan}
                            onChange={(e) => setLandFormData(prev => ({...prev, ID_general_plan:e.target.value}))}
                            options={
                                <>
                                    <option value="">BRAK</option>
                                    {
                                        selectData.general_plans.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                                    }
                                </>
                            }
                        />
                        <SelectInput
                            title="MPZP"
                            placeholder=""
                            value={landFormData.ID_mpzp}
                            onChange={(e) => setLandFormData(prev => ({...prev, ID_mpzp:e.target.value}))}
                            options={
                                <>
                                    <option value="">BRAK</option>
                                    {
                                        selectData.mpzp.map((obj, index) => <option key={index} value={obj.ID}>{obj.kod}</option>)
                                    }
                                </>
                            }
                        />
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SimpleTextArea
                            title="Opis działki (opcjonalny)"
                            placeholder="land description..."
                            value={landFormData.description}
                            onChange={(e) => setLandFormData(prev => ({...prev, description:e.target.value}))}
                            error={landErrors.description}
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
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SimpleInput
                            type="date"
                            title="Data zakupu"
                            placeholder="purchase date..."
                            value={landFormData.purchase_date}
                            onChange={(e) => setLandFormData(prev => ({...prev, purchase_date:e.target.value}))}
                            error={landErrors.purchase_date}
                        />
                        <SimpleInput
                            title="Numer aktu"
                            placeholder="case number..."
                            value={landFormData.case_number}
                            onChange={(e) => setLandFormData(prev => ({...prev, case_number:e.target.value}))}
                            error={landErrors.case_number}
                        />
                        <SimpleInput
                            title="Sprzedawca (od kogo)"
                            placeholder="seller (from whom)..."
                            value={landFormData.seller}
                            onChange={(e) => setLandFormData(prev => ({...prev, seller:e.target.value}))}
                            error={landErrors.seller}
                        />
                        <SimpleInput
                            type="number"
                            step="any"
                            min={0}
                            title="Cena zakupu (PLN)"
                            placeholder="purchase cost (PLN)..."
                            value={landFormData.price}
                            onChange={(e) => setLandFormData(prev => ({...prev, price:e.target.value}))}
                            error={landErrors.price}
                        />
                    </section>
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <SimpleInput
                            type="date"
                            title="Data sprzedaży (opcjonalnie)"
                            placeholder="sell date..."
                            value={landFormData.sell_date}
                            onChange={(e) => setLandFormData(prev => ({...prev, sell_date:e.target.value}))}
                            error={landErrors.sell_date}
                        />
                    </section>
                </>
            }
        />
    )
}