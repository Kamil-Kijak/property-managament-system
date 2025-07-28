
import {useState, useEffect, useRef} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../hooks/useForm";
import InsertLandType from "../forms/InsertLandType";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";

export default function LandTypesPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update)

    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{0,49}$/, error:"Za długi"}
    })

    const [landTypes, setLandTypes] = useState([]);
    const [form, setForm] = useState(null);
    const [editLandTypeID, setEditLandTypeID] = useState(null);


    const getLandTypes = () => {
        loadingUpdate(true);
        request("/api/land_types/get", {}).then(result => {
            if(!result.error) {
                setLandTypes(result.data)
            }
            loadingUpdate(false);
        })
    }

    useEffect(() => {
        getLandTypes();
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/land_types/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_type:ID})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
                }
                loadingUpdate(false);
            })
    }
    const requestEditLandType = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/land_types/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_type:editLandTypeID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
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
                    <section className="my-10">
                        {landTypes.map((ele) => {
                            return (
                                <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                    <h1 className="text-4xl text-green-600 font-bold">ID: {ele.ID}</h1>
                                    <section className="flex flex-col items-start justify-center">
                                        <h1 className="mx-10 text-2xl">{ele.nazwa}</h1>
                                    </section>
                                    <section className="flex flex-col items-center">
                                        <button className="info-btn" onClick={() => {
                                            setForm("edit");
                                            setEditLandTypeID(ele.ID)
                                            setEditFormData({
                                                name:ele.nazwa
                                            });
                                        }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                        <button className="warning-btn" onClick={() => {
                                            warningUpdate(true, "Uwaga", () => requestDelete(ele.ID), () => warningUpdate(false),
                                                <>
                                                    <p className="text-red-600 font-bold">
                                                        Usunięcie tego typu działki spowoduje że każda działka która ma ten typ w systemie zostanie usunięta nieodwracalnie
                                                        </p>
                                                    <p className="text-white font-bold text-lg mt-5">
                                                        Czy napewno chcesz usunąć ten typ działki?
                                                    </p>
                                                </>
                                            )
                                        }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                    </section>
                                </section>
                            )
                        })}
                    </section>
                    <button className="base-btn text-2xl" onClick={() => {
                        setForm("insert")
                    }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy rodzaj działki</button>
                    </>
                }
                {
                    form == "insert" &&
                    <InsertLandType getLandTypes={getLandTypes} setForm={setForm}/>
                }
                {
                    form == "edit" && 
                    <>
                        <section className="my-10">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl my-2 text-center">Edycja rodzaju działki</h1>
                            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                            <section className="py-2 flex-col items-center">
                                <SimpleInput
                                    title="Nazwa rodzaju"
                                    placeholder="type name..."
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}
                                    error={editErrors.name}
                                />
                            </section>
                            <button className="base-btn" onClick={() => {
                                if(Object.keys(editFormData).length == 1) {
                                    if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                        requestEditLandType();
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