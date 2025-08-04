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
import SelectInput from "../components/inputs/SelectInput";



export default function GroundClassesPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update)
    const [taxDistrict, setTaxDistrict] = useState(1);
    const request = useRequest();

    const [groundClasses, setGroundClasses] = useState([]);
    const [form, setForm] = useState(null);
    const [editGroundClassID, setEditGroundClassID] = useState(null);
    
    const [editFormData, editErrors, setEditFormData] = useForm({
        "ground_class":{regexp:/^.{0,10}$/, error:"Za długi"},
        "converter":{regexp:/^\d{1}\.\d{2}$/, error:"Nie ma 2 cyfr po , lub za duża liczba"},
        "tax":{regexp:/.+/, error:"Wybierz rodzaj podatku"},
    });

    useEffect(() => {
        search()
    }, [taxDistrict]);

    const search = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            tax_district:taxDistrict
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
                                    <SearchSelectInput
                                        title="okręg podatkowy"
                                        placeholder=""
                                        value={taxDistrict}
                                        onChange={(e) => setTaxDistrict(e.target.value)}
                                        options={
                                            <>
                                                <option value="1">I</option>
                                                <option value="2">II</option>
                                                <option value="3">III</option>
                                                <option value="4">IV</option>
                                            </>
                                        }
                                    />
                                </>
                            }
                        />
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {groundClasses.length}</h1>
                        <section className="my-5">
                            {
                                groundClasses.map((obj, index) =>
                                <section className="base-card" key={index}>
                                    <section className="flex gap-x-10 items-center">
                                        <h1 className="text-4xl text-green-600 font-bold">{obj.klasa}</h1>
                                        <section className="flex flex-col items-center justify-center">
                                            <h1 className="font-bold text-xl">Przelicznik</h1>
                                            <p className="mx-10 text-xl">{obj.przelicznik}</p>
                                        </section>
                                        <section className="flex flex-col items-center justify-center">
                                            <h1 className="font-bold text-xl">Rodzaj podatku klasy</h1>
                                            <p className="mx-10 text-xl">{obj.podatek}</p>
                                        </section>
                                        <section className="flex gap-x-3">
                                            <button className="info-btn" onClick={() => {
                                                setForm("edit")
                                                setEditFormData({
                                                    ground_class:obj.klasa,
                                                    converter:obj.przelicznik,
                                                    tax:obj.podatek
                                                })
                                                setEditGroundClassID(obj.ID)
                                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                            <button className="warning-btn" onClick={() => 
                                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                                <>
                                                    <p className="text-red-600 font-bold">
                                                        Usunięcie tej klasy gruntu spowoduje że wszystkie wyznaczone powierzchnie tej klasy zostaną usunięte
                                                    </p>
                                                    <p className="text-white font-bold text-lg mt-5">
                                                        Czy napewno chcesz usunąć tą klase gruntu?
                                                    </p>
                                                </>
                                            )
                                            }><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                        </section>
                                    </section>
                                </section>
                                )
                            }
                            <section className="flex flex-col gap-y-2 items-center my-10">
                                <button className="base-btn text-2xl" onClick={() => setForm("insert")}><FontAwesomeIcon icon={faPlus}/> Dodaj nową klase gruntu</button>
                                <h1 className="text-2xl font-bold">Dla okręgu podatkowego nr {taxDistrict}</h1>
                            </section>
                        </section>
                    </>
                }
                {
                    form == "insert" && <InsertGroundClass setForm={setForm} search={search} taxDistrict={taxDistrict}/>
                }
                {
                    form == "edit" && 
                    <>
                        <section className="my-10">
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
                                <SelectInput
                                    title="Rodzaj podatku klasy"
                                    value={editFormData.tax}
                                    onChange={(e) => setEditFormData(prev => ({...prev, tax:e.target.value}))}
                                    options={
                                            <>
                                                <option value="rolny">Rolny</option>
                                                <option value="leśny">Leśny</option>
                                            </>
                                        }
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