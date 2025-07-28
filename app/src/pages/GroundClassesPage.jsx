import { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useLocalizations } from "../hooks/useLocalizations";
import SearchBar from "../components/SearchBar";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import { useState } from "react";
import SearchSelectInput from "../components/inputs/SearchSelectInput";
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import InsertGroundClass from "../forms/InsertGroundClass";
import { useForm } from "../hooks/useForm";
import SimpleInput from "../components/inputs/SimpleInput";



export default function GroundClassesPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update)
    const [availableLocalizations, localizations, setLocalizations] = useLocalizations();
    const request = useRequest();

    const [groundClasses, setGroundClasses] = useState([]);
    const [form, setForm] = useState(null);
    const [editGroundClassID, setEditGroundClassID] = useState(null);
    
    const [editFormData, editErrors, setEditFormData] = useForm({
        "ground_class":{regexp:/^.{0,10}$/, error:"Za długi"},
        "converter":{regexp:/^\d{1}\.\d{2}$/, error:"Nie ma 2 cyfr po , lub za duża liczba"},
        "tax":{regexp:/^\d{1,3}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    });

    useEffect(() => {
        if(localizations.commune != "")
            search()
    }, [localizations.commune]);

    const search = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            province: localizations.province,
            district: localizations.district,
            commune: localizations.commune,
        });
        request(`/api/ground_classes/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    setGroundClasses(result.data);
                }
                loadingUpdate(false);
            })
    }

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/ground_classes/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_ground_class:ID})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })

    }
    const requestEdit = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/ground_classes/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_ground_class:editGroundClassID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })
    }

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                {
                    !form &&
                    <>
                        <SearchBar
                            onSearch={search}
                            elements={
                            <>
                                <section className="w-[150px]">
                                    <SearchSelectInput
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
                                    <SearchSelectInput
                                        title="Powiat"
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
                            </>}
                        />
                        <section className="my-10">
                            {
                                groundClasses.map((obj, index) =>
                                <section key={index} className="base-card">
                                    <section className="flex items-center">
                                        <h1 className="text-4xl text-green-600 font-bold">{obj.klasa}</h1>
                                        <section className="flex flex-col items-center justify-center">
                                            <p className="mx-10 text-xl font-bold">Przelicznik</p>
                                            <p className="mx-10 text-xl">{obj.przelicznik}</p>
                                        </section>
                                        <section className="flex flex-col items-center justify-center">
                                            <p className="mx-10 text-xl font-bold">Podatek za ha</p>
                                            <p className="mx-10 text-xl">{obj.podatek_za_hektar}zł</p>
                                        </section>
                                        <section className="flex items-center justify-center gap-x-3">
                                            <button className="info-btn" onClick={() => {
                                                setForm("edit");
                                                setEditGroundClassID(obj.ID)
                                                setEditFormData({
                                                    ground_class:obj.klasa,
                                                    converter:obj.przelicznik,
                                                    tax:obj.podatek_za_hektar
                                                })
                                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                            <button className="warning-btn" onClick={() => {
                                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                                    <>
                                                        <p className="text-red-600 font-bold">
                                                            Usunięcie tej klasy spowoduje że każda wyznaczona powierzchnia działek tej klasy zostanie usunięta
                                                            </p>
                                                        <p className="text-white font-bold text-lg mt-5">
                                                            Czy napewno chcesz usunąć tą klase?
                                                        </p>
                                                    </>
                                                )
                                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                        </section>
                                    </section>
                                </section>)
                            }
                        </section>
                        {
                            localizations.commune != "" ?
                            <section className="flex flex-col items-center">
                                <button className="base-btn text-2xl" onClick={() => setForm("insert")}><FontAwesomeIcon icon={faPlus}/> Dodaj nową klase gruntu</button>
                                <h1 className="text-xl font-bold">Dla {localizations.commune}, {localizations.district}, {localizations.province}</h1>
                            </section>
                            :
                            <h1 className="text-3xl">Wybierz odpowiednią gmine żeby pokazać jej klasy gruntów</h1>
                        }
                    </> 
                }
                {
                    form == "insert" && 
                    <InsertGroundClass 
                        setForm={setForm} 
                        search={search} 
                        commune={localizations.commune} 
                        district={localizations.district} 
                        province={localizations.province}
                    />
                }
                {
                    form == "edit" &&
                    <>
                        <section className="my-4">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl my-2 text-center">Edycja klasy gruntu</h1>
                            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                            <section className="py-2 flex-col items-center">
                                <SimpleInput
                                    title="Klasa"
                                    placeholder="class..."
                                    value={editFormData.ground_class}
                                    onChange={(e) => setEditFormData(prev => ({...prev, ground_class:e.target.value}))}
                                    error={editErrors.ground_class}
                                />
                                <SimpleInput
                                    type="number"
                                    step="any"
                                    min={0}
                                    title="Przelicznik"
                                    placeholder="converter..."
                                    value={editFormData.converter}
                                    onChange={(e) => setEditFormData(prev => ({...prev, converter:e.target.value}))}
                                    error={editErrors.converter}
                                />
                                <SimpleInput
                                    type="number"
                                    step="any"
                                    min={0}
                                    title="Podatek za ha"
                                    placeholder="tax per ha..."
                                    value={editFormData.tax}
                                    onChange={(e) => setEditFormData(prev => ({...prev, tax:e.target.value}))}
                                    error={editErrors.tax}
                                />
                            </section>
                            <button className="base-btn text-2xl" onClick={() => {
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